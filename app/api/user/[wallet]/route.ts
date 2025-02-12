import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { OwnedTokensResponse, Token } from '@/types';
import { fetchStargazeTokens, getAssosiatedName } from '@/lib/utils';
import { getLeaderboard, updateNftOwner } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {
    try {
        const { wallet } = params;
        const { searchParams } = request.nextUrl;

        // Check if user exists
        let user = await prisma.mst_users.findUnique({
            where: {
                user_address: wallet
            }
        });

        const collections = await prisma.mst_collection.findMany();

        // If user doesn't exist, create new user
        if (!user) {
            const resp: OwnedTokensResponse = await fetchStargazeTokens({
                owner: wallet,
                collectionAddress: collections.map((collection) => collection.collection_address).join(","),
                limit: 1,
                offset: 0
            });

            const tokens: Token[] = resp.tokens;

            user = await prisma.mst_users.create({
                data: {
                    user_address: wallet,
                    user_created_date: new Date(),
                    user_image_url: tokens.length > 0 ? tokens[0].media?.url : DEFAULT_IMAGE_PROFILE
                }
            });
        }


        for(let collection of collections){
            const staker = await prisma.mst_staker.findFirst({
                where: { staker_address: wallet, staker_collection_id: collection.collection_id }
            });
    
            if (staker && collection.collection_address) {
                updateNftOwner(wallet, collection.collection_address);
            }
        }

        const distribusiWinner = await prisma.trn_distribusi_reward.findFirst({
            where: {
                distribusi_wallet: wallet,
                distribusi_is_claimed: "N"
            }
        });

        const associatedName = await getAssosiatedName(wallet);

        const stakers = await prisma.mst_staker.findMany({
            where: {
                staker_address: wallet
            },
            include: {
                projects: true
            }
        });

        return NextResponse.json(
            {
                message: 'successfully',
                data: {
                    associated: associatedName,
                    user: { ...user, is_winner: distribusiWinner ? "Y" : "N" },
                    staker: stakers,
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get User Error:', error);
        return NextResponse.json(
            {
                message: 'Failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}