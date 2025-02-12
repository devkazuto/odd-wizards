import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import getConfig from '@/config/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raffle_id, wallet_address, amount } = body;

    const raffle = await prisma.trn_raffle.findUnique({
      where: { raffle_id },
    });

    if (!raffle) {
      return NextResponse.json({ message: 'Raffle not found' }, { status: 400 });
    }

    const project = await prisma.mst_project.findFirst({
      where: { project_symbol: raffle.raffle_price_type },
    });

    if (!project) {
      return NextResponse.json({ message: 'Invalid Price Type' }, { status: 500 });
    }

    const stakers = await prisma.mst_staker.findMany({
      where: { staker_address: wallet_address, staker_project_id: project.project_id },
      orderBy: { staker_total_points: 'desc' },
    });

    const totalBalance = stakers.reduce((sum, staker) => sum + (staker.staker_total_points ?? 0), 0);
    const totalPrice = (raffle.raffle_price ?? 0) * amount;

    if (totalBalance < totalPrice) {
      return NextResponse.json({ message: 'Insufficient balance to buy ticket' }, { status: 400 });
    }

    await prisma.$transaction(async (prisma) => {
      let remainingAmount = totalPrice;

      for (let staker of stakers) {
        if (remainingAmount <= 0) break;

        const deduction = Math.min(staker.staker_total_points ?? 0, remainingAmount);
        remainingAmount -= deduction;

        await prisma.mst_staker.update({
          where: { staker_id: staker.staker_id },
          data: { staker_total_points: { decrement: deduction } },
        });
      }

      await prisma.trn_participant.create({
        data: {
          participant_address: wallet_address,
          participant_created_date: new Date(),
          participant_amount: amount,
          participant_raffle_id: raffle_id,
        },
      });
    });

    return NextResponse.json({ message: 'Buy Ticket successfully' }, { status: 201 });
  } catch (error) {
    console.error('Buy Ticket Error:', error);
    return NextResponse.json({ message: 'Failed to Buy Ticket', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
