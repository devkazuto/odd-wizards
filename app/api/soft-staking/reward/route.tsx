import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { extractCollectionAndTokenId, getToken } from '@/lib/utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address');
        const staker_address = searchParams.get('wallet_address');

        if (!staker_address) {
            return NextResponse.json(
                { message: 'wallet_address is required' },
                { status: 400 }
            );
        }

        if (!collection_address) {
            return NextResponse.json(
                { message: 'collection_address is required' },
                { status: 400 }
            );
        }

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

        const staker = await prisma.mst_staker.findFirst({
            where: { staker_address: staker_address, staker_collection_id: collection.collection_id }
        })

        if (!staker) {
            return NextResponse.json(
                { message: 'Staker not found' },
                { status: 400 }
            );
        }

        const reward = await prisma.trn_distribusi_reward.findFirst({
            where: {
                distribusi_collection: collection.collection_id,
                distribusi_wallet: staker_address
            }
        });

        if(!reward){
            return NextResponse.json(
                { message: 'Reward not found' },
                { status: 400 }
            );
        }

        const { collection: rewardCollection, tokenId } = extractCollectionAndTokenId(reward.distribusi_reward ?? "");

        const token = await getToken(rewardCollection ?? "-", tokenId ?? "-");

        return NextResponse.json(
            {
                message: 'Get points successfully',
                data: {
                    token: token,
                    isClaimed: reward.distribusi_is_claimed == "Y",
                    txHash: reward.distribusi_tx_hash
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