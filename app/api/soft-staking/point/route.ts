import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

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

        const totalStake = stakers.reduce(
            (sum, staker) => sum + (staker.staker_nft_staked || 0),
            0
        );

        const stakerTotalPoints = stakers.reduce(
            (sum, staker) => sum + (staker.staker_total_points || 0),
            0
        );

        return NextResponse.json(
            {
                message: 'Get points successfully',
                data: {
                    point: stakerTotalPoints,
                    totalStake: totalStake
                }
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Get points Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get points',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}