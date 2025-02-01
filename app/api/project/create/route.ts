import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { z } from 'zod';
import { uploadFile } from '@/lib/utils';
import { mst_collection } from '@prisma/client';
import getConfig from '@/config/config';

const config = getConfig();

// Validation Schema
const ProjectSchema = z.object({
  project_code: z.string().min(1, 'Project name is required'),
  project_name: z.string().min(1, 'Project name is required'),
  project_description: z.string().optional(),
  project_banner: z.string().url().optional(),
  project_status: z.string().optional().default('N'),
  project_is_leaderboard: z.string().optional().default('N'),
  project_footer_discord: z.string().optional(),
  project_footer_twitter: z.string().optional(),
  project_footer_discord_color: z.string().optional(),
  project_footer_twitter_color: z.string().optional(),
  collections: z.any()
});

// CREATE Project
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const wallet_address = searchParams.get('wallet_address') || '';

    if(config && !config.owners.includes(wallet_address)){
      return NextResponse.json(
        { 
          message: 'Unauthorized to create a project', 
          error: 'Wallet address is not authorized to create a project' 
        }, 
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // Extract fields from formData
    const projectData = {
      project_code: formData.get('project_code') as string,
      project_name: formData.get('project_name') as string,
      project_description: formData.get('project_description') as string | undefined,
      project_status: formData.get('project_status') as string | undefined,
      project_is_leaderboard: formData.get('project_is_leaderboard') as string | undefined,
      project_footer_discord_color: formData.get('project_footer_discord_color') as string | undefined,
      project_footer_twitter_color: formData.get('project_footer_twitter_color') as string | undefined,
    };

    // Validate input
    const validatedData = ProjectSchema.parse(projectData);

    const collections = formData.get("collections") as string | null;

    // Handle file uploads if needed
    const fileBanner = formData.get("project_banner") as File | null;
    const fileTwitter = formData.get("project_footer_twitter") as File | null;
    const fileDiscord = formData.get("project_footer_discord") as File | null;

    // Here you can add logic to handle file uploads, e.g., uploading to a cloud storage service
    // For now, we'll just log the files
    if (fileBanner) {
      console.log('Banner file received:', fileBanner.name);
      const pathBanner = await uploadFile(fileBanner);
      validatedData.project_banner = pathBanner;
    }
    if (fileTwitter) {
      console.log('Twitter file received:', fileTwitter.name);
      const pathTwitter = await uploadFile(fileTwitter);
      validatedData.project_footer_twitter = pathTwitter;
    }
    if (fileDiscord) {
      console.log('Discord file received:', fileDiscord.name);
      const pathDiscord = await uploadFile(fileDiscord);
      validatedData.project_footer_discord = pathDiscord;
    }

    // Create project in the database
    const project = await prisma.mst_project.create({
      data: validatedData
    });

    if(collections){
      const collectionsParse = JSON.parse(collections);
      for(let collection of collectionsParse){
        collection.collection_project_id = project.project_id;
        collection.collection_supply = Number(collection.collection_supply);
        await prisma.mst_collection.create({
          data: collection
        });
      }
    }

    return NextResponse.json(
      { 
        message: 'Project created successfully', 
        data: project 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Project Creation Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: error.errors 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Failed to create project', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 400 }
    );
  }
}
// READ Projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const projects = await prisma.mst_project.findMany({
      where: {
        OR: [
          { project_name: { contains: search, mode: 'insensitive' } },
          { project_description: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip,
      take: limit,
      include: {
        rewards: {
          select: {
            reward_id: true,
            reward_name: true
          }
        },
        collections: {
          select: {
            collection_id: true,
            collection_name: true
          }
        }
      }
    });

    const total = await prisma.mst_project.count({
      where: {
        OR: [
          { project_name: { contains: search, mode: 'insensitive' } },
          { project_description: { contains: search, mode: 'insensitive' } }
        ]
      }
    });

    return NextResponse.json(
      { 
        message: 'Projects retrieved successfully',
        data: projects,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Project Retrieval Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to retrieve projects', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// UPDATE Project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, ...updateData } = body;

    if (!project_id) {
      return NextResponse.json(
        { message: 'Project ID is required' }, 
        { status: 400 }
      );
    }

    // Validate input, but make all fields optional for updates
    const validatedData = ProjectSchema.partial().parse(updateData);

    const updatedProject = await prisma.mst_project.update({
      where: { project_id },
      data: validatedData
    });

    return NextResponse.json(
      { 
        message: 'Project updated successfully', 
        data: updatedProject 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Project Update Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: error.errors 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Failed to update project', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 400 }
    );
  }
}

// DELETE Project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json(
        { message: 'Project ID is required' }, 
        { status: 400 }
      );
    }

    await prisma.mst_project.delete({
      where: { project_id: parseInt(project_id) }
    });

    return NextResponse.json(
      { message: 'Project deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Project Deletion Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete project', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}