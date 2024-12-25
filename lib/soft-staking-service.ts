import { mst_attributes_reward, Prisma } from "@prisma/client";
import calculatePoint, { fetchAllStargazeTokens } from "./utils";
import prisma from '@/prisma/prisma';

export async function updateNftOwner(address: string, collection_address: string) {
    try {
        const collection = await prisma.mst_collection.findFirst({
            where: { collection_address: collection_address },
            include: {
              mst_staker: false
            }
        });

        if (!collection) throw new Error("Collection not found");

        const staker = await prisma.mst_staker.findFirst({
            where: { 
                staker_address: address, 
                staker_collection_id: collection.collection_id 
            }
        });

        if (!staker) throw new Error("Staker not found");

        let allTokens = await fetchAllStargazeTokens({
            owner: address,
            collectionAddress: collection_address
        });
        
        const updatedStaker = await prisma.mst_staker.update({
            where: { staker_id: staker.staker_id },
            data: {
                staker_nft_staked: allTokens.length
            }
        });

        return updatedStaker;

    } catch (error) {
        console.error("Error in updateNftOwner:", error);
        throw error;
    }
}


export async function getTotalPoints(address: string, collection_address: string){

    const collection = await prisma.mst_collection.findFirst({
        where: { collection_address: collection_address },
        include: {
            mst_staker: false
        }
    });

    if (!collection) {
        throw Error("Collection not found")
    }

    const staker = await prisma.mst_staker.findFirst({
        where: { staker_address: address, staker_collection_id: collection.collection_id }
    })

    if (!staker) {
        throw Error("Staker not found");
    }

    const attributes_rewards = await prisma.mst_attributes_reward.findMany({
        where: { attr_collection_id: collection.collection_id }
    });

    let allTokens = await fetchAllStargazeTokens({
        owner: address,
        collectionAddress: collection_address,
        filterForSale: 'UNLISTED'
    });

    console.log("allTokens", allTokens.length);

    let attrreward: mst_attributes_reward[] = [];
    allTokens.forEach((nft) => {
        nft.traits.forEach(trait => {
            const matchingReward = attributes_rewards.find(reward => 
                reward.attr_key == trait.name && 
                reward.attr_val == trait.value
            );
            
            if (matchingReward) {
                attrreward.push(matchingReward);
            }
        });
    });

    console.log("attrreward", attrreward.length);

    const totalPoints = attrreward?.reduce((sum, reward) => 
        sum + calculatePoint(reward, staker.staker_lastclaim_date), 0
    );

    return  {
        totalNft: allTokens.length,
        point: totalPoints
    };
}

export async function getLeaderboard(collection_address: string, staker_address: string | null, page: number, size: number){
    const leaderboard: any = await prisma.$queryRaw`
            WITH leaderboard_points AS (
                SELECT
                    mc.collection_address,
                    ms.staker_address,
                    ms.staker_nft_staked,
                    ms.staker_red_flag,
                    mu.user_image_url,
                    SUM(tp.point_amount) as total_points
                FROM trn_point tp
                LEFT JOIN mst_staker ms ON ms.staker_id = tp.point_staker_id 
                LEFT JOIN mst_users mu ON mu.user_address = ms.staker_address
                LEFT JOIN mst_collection mc ON mc.collection_id = ms.staker_collection_id
                WHERE mc.collection_address = ${collection_address}
                AND ms.staker_nft_staked > 0
                GROUP BY mc.collection_address, ms.staker_address, ms.staker_nft_staked, ms.staker_red_flag, mu.user_image_url
            ),
            ranked_leaderboard AS (
                SELECT 
                    *,
                    ROW_NUMBER() OVER (
                        PARTITION BY collection_address 
                        ORDER BY total_points DESC
                    ) as ranking
                FROM leaderboard_points
            )
            SELECT 
                collection_address,
                staker_address,
                staker_nft_staked,
                staker_red_flag,
                user_image_url,
                total_points,
                ranking
            FROM ranked_leaderboard
            WHERE 1=1
            ${staker_address ? Prisma.sql`AND staker_address = ${staker_address}` : Prisma.empty}
            ORDER BY total_points DESC, ranking
            LIMIT ${size} OFFSET ${page * size};
        `;
        
    return leaderboard;
}