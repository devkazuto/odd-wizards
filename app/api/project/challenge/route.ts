import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: NextRequest) {
    try {

        const projects = await prisma.mst_project.findMany({
            where: {
                project_status: 'P',
                project_is_leaderboard: "Y"
            },
            include: {
                rewards: true
            },
            orderBy: [
                {
                    project_status: 'desc'
                },
                {
                    project_seqn: 'asc'
                }
            ]
         });

        return NextResponse.json(
            {
                message: 'Get Challenge successfully',
                data: projects,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get Challenge Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get Challenge',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}