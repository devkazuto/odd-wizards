import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { LeaderboardItem } from '@/types/leaderboard';
import { getLeaderboard } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address');
        const staker_address = searchParams.get('wallet_address');
        const size = parseInt(searchParams.get('size') || '10'); // Default size 10
        const page = parseInt(searchParams.get('page') || '0'); // Default page 0

        if (!collection_address) {
            return NextResponse.json(
                { message: 'collection_address is required' },
                { status: 400 }
            );
        }

        const leaderboard = await getLeaderboard(collection_address, staker_address, page, size);

        // Handle BigInt serialization
        const leaderboardWithBigIntAsString = leaderboard.map((item: any) => ({
            ...item,
            total_points: item.total_points.toString(),
            ranking: item.ranking.toString()
        }));

        return NextResponse.json(
            {
                message: 'Get leaderboard successfully',
                data: leaderboardWithBigIntAsString
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get leaderboard Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get leaderboard',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}