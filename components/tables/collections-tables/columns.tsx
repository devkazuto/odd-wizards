'use client';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation'; // Corrected import
import React from 'react'; // Import React
import { formatDate } from '@/lib/utils';
import { MstCollection } from '@/types/collection';

type ColumnsFunction = (router: ReturnType<typeof useRouter>, page: number, perpage: number) => ColumnDef<MstCollection>[];


export const columns: ColumnsFunction = (router, page, perpage) => [
  {
    id: 'select',
    header: () => (
      <div className='w-full text-center'>No</div>
    ),
    cell: ({ row }) => (
      <div className='w-full text-center'>{row.index + 1 + ((page ? page - 1 : 0) * perpage)}</div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'collection_code',
    header: 'Collection ID'
  },
  {
    accessorKey: 'collection_name',
    header: 'Collection Name'
  },
  {
    accessorKey: 'collection_description',
    header: 'Description'
  },
  {
    accessorKey: 'collection_supply',
    header: 'Supply'
  },
];
