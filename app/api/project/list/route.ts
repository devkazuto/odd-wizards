import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: NextRequest) {
    try {

        const projects = await prisma.mst_project.findMany({
            where: {
                project_status: {
                    not: "C"
                }
            },
            orderBy: {
                project_status: 'desc'
            }
         });

        return NextResponse.json(
            {
                message: 'Get Project successfully',
                data: projects,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get Project Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get Project',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}