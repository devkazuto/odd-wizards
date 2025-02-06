import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// READ Single Collection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const code = params.id;

    const project = await prisma.mst_project.findFirst({
      where: { project_code: code },
      include: {
        collections: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Project retrieved successfully', 
        data: project 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Project Retrieval Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to retrieve Project', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}