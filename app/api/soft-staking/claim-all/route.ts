import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getTotalPoints } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address') as string;

        const collection = await prisma.mst_collection.findFirst({
            where: { collection_address: collection_address },
            include: {
                mst_staker: false
            }
        });

        if (!collection) {
            return NextResponse.json(
                { message: 'Collection not found' },
                { status: 400 }
            );
        }

        const stakers = await prisma.mst_staker.findMany();
        console.log("all ", stakers.length);
        let i = 1;
        for (const staker of stakers) {

            const staker_address = staker.staker_address;
            if(!staker_address) continue;
            
            const resp = await getTotalPoints(staker_address, collection_address);

            console.log(i++, "process ", staker_address, resp.point);

            if (resp.point == 0) continue;

            await prisma.trn_point.create({
                data: {
                    point_amount: resp.point,
                    point_nft_staked: resp.totalNft,
                    point_staker_id: staker.staker_id,
                    point_claim_date: new Date()
                }
            });

            if (resp.point >= 1) {
                await prisma.mst_staker.update({
                    where: { staker_id: staker.staker_id },
                    data: {
                        staker_lastclaim_date: new Date(),
                        staker_nft_staked: resp.totalNft,
                        staker_total_points: (staker.staker_total_points ?? 0) + resp.point
                    }
                });
            }
        }

        return NextResponse.json(
            {
                message: 'Claim All successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Claim points Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Claim',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}