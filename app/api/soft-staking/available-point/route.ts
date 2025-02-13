import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getTotalPoints } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const project_code = searchParams.get('project_code');
        const staker_address = searchParams.get('wallet_address');

        if (!staker_address) {
            return NextResponse.json(
                { message: 'wallet_address is required' },
                { status: 400 }
            );
        }

        if (!project_code) {
            return NextResponse.json(
                { message: 'project_code is required' },
                { status: 400 }
            );
        }

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

        // if (resp.point == 0) {
        //     return NextResponse.json(
        //         { message: 'No points available to claim' },
        //         { status: 400 }
        //     );
        // }

        const stakerTotalPoints = stakers.reduce(
            (sum, staker) => sum + (staker.staker_total_points || 0),
            0
        );

        return NextResponse.json(
            {
                message: 'Get available points successfully',
                data: {
                    staker: { ...stakers, staker_total_points: stakerTotalPoints },
                    points: resp.point ?? 0
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get available points Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get available points',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}