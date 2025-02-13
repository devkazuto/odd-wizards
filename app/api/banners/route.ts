import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getLaunchpad } from '@/lib/utils';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const banners = await prisma.mst_banners.findMany({
            where: {
                banner_status: 'P'
            },
            orderBy: [
                {
                    banner_seqn: 'asc'
                }
            ]
        });

        // Use Promise.all to wait for all launchpad data
        const bannersWithLaunchpad = await Promise.all(
            banners.map(async (banner) => {
                if (banner.banner_collection_address) {
                    const launchpad = await getLaunchpad(banner.banner_collection_address);
                    // Return a new object with the launchpad data
                    return {
                        ...banner,
                        launchpad
                    };
                }
                return banner;
            })
        );

        return NextResponse.json(
            {
                message: 'Get Banners successfully',
                data: bannersWithLaunchpad,
            },
            { 
                status: 200,
                headers: {
                  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
                }
            }
        );
    } catch (error) {
        console.error('Get Banners Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get Banners',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}