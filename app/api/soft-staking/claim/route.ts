import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getTotalPoints } from '@/lib/soft-staking-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            staker_address,
            project_code,
        } = body;

        const project = await prisma.mst_project.findFirst({
            where: {
                project_code: project_code
            },
            include: {
                collections: true
            }
        })

        if (!project) {
            return NextResponse.json(
                { message: 'project not found' },
                { status: 400 }
            );
        }

        const stakers = await prisma.mst_staker.findMany({
            where: {
                staker_address: staker_address,
                staker_project_id: project.project_id
            }
        })

        if (stakers.length == 0) {
            return NextResponse.json(
                { message: 'Staker not found' },
                { status: 400 }
            );
        }

        const resp = await getTotalPoints(staker_address, project.project_id);

        if (resp.point == 0) {
            return NextResponse.json(
                { message: 'No points available to claim' },
                { status: 400 }
            );
        }

        for (let data of resp.listPoints) {
            await prisma.trn_point.create({
                data: {
                    point_amount: resp.point,
                    point_nft_staked: resp.totalNft,
                    point_staker_id: data.staker_id,
                    point_claim_date: new Date()
                }
            });

            if (resp.point >= 1) {
                await prisma.mst_staker.update({
                    where: { staker_id: data.staker_id },
                    data: {
                        staker_lastclaim_date: new Date(),
                        staker_nft_staked: resp.totalNft,
                        staker_total_points: (data.points ?? 0) + resp.point
                    }
                });
            }
        }

        const stakerTotalPoints = stakers.map(staker => staker.staker_total_points?.toString() ?? 0);

        return NextResponse.json(
            {
                message: 'Claim successfully',
                data: {
                    staker: { ...stakers, staker_total_points: stakerTotalPoints },
                    point: resp.point
                }
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