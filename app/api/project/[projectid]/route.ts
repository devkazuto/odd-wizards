import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// READ Single Collection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const collection = await prisma.mst_collection.findUnique({
      where: { collection_id: id },
      include: {
        mst_staker: true
      }
    });

    if (!collection) {
      return NextResponse.json(
        { message: 'Collection not found' }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Collection retrieved successfully', 
        data: collection 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Collection Retrieval Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to retrieve collection', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// UPDATE Collection
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const { 
      collection_address, 
      collection_name, 
      collection_description 
    } = body;

    const collection = await prisma.mst_collection.update({
      where: { collection_id: id },
      data: {
        collection_address,
        collection_name,
        collection_description
      }
    });

    return NextResponse.json(
      { 
        message: 'Collection updated successfully', 
        data: collection 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Collection Update Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update collection', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 400 }
    );
  }
}

// DELETE Collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.mst_collection.delete({
      where: { collection_id: id }
    });

    return NextResponse.json(
      { message: 'Collection deleted successfully' }, 
      { status: 204 }
    );
  } catch (error) {
    console.error('Collection Deletion Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete collection', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 400 }
    );
  }
}

// Tambahan: Contoh Custom Query
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'bulk_update':
        // Contoh operasi batch
        const updatedCollections = await prisma.mst_collection.updateMany({
          where: { 
            collection_name: { contains: 'test' } 
          },
          data: { 
            collection_description: 'Updated via batch operation' 
          }
        });

        return NextResponse.json(
          { 
            message: 'Bulk update successful', 
            data: updatedCollections 
          }, 
          { status: 200 }
        );

      default:
        return NextResponse.json(
          { message: 'Invalid action' }, 
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Patch Operation Error:', error);
    return NextResponse.json(
      { 
        message: 'Patch operation failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}