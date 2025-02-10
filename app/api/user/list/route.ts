import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: NextRequest) {
    try {
        const totalUsers = await prisma.mst_users.count();
        const users = await prisma.mst_users.findMany({
            where: {
                user_image_url: {
                    not: null
                }
            },
            take: 10
        });

        return NextResponse.json(
            {
                message: 'Get Users successfully',
                data: {
                    users: users,
                    total: totalUsers
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get Users Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get Users',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}