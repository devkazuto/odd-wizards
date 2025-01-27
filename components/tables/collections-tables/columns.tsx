'use client';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation'; // Corrected import
import React from 'react'; // Import React
import { formatDate } from '@/lib/utils';
import { MstCollection } from '@/types/collection';

type ColumnsFunction = (router: ReturnType<typeof useRouter>, page: number, perpage: number) => ColumnDef<MstCollection>[];


function ActionCell({ row }: any) {
  let actions = row.original.actAction.split(';');

  return (
    actions.map((action: string, index: number) => (
      <div key={index} className='w-[350px]'>{action}</div>
    ))
  )
}

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
    accessorKey: 'actCreatedBy',
    header: 'Username'
  },
  {
    accessorKey: 'roleName',
    header: 'Role'
  },
  {
    accessorKey: 'unitName',
    header: 'SBU'
  },
  {
    accessorKey: 'locName',
    header: 'Lokasi'
  },
  {
    accessorKey: 'actModul',
    header: 'Module'
  },
  {
    accessorKey: 'actAction',
    header: 'Aksi',
    cell: ActionCell
  },
  {
    accessorKey: 'actDate',
    header: 'Tanggal',
    cell: ({ row }) => (
      <div>{row.original.collection_id}</div>
    )
  },
];
