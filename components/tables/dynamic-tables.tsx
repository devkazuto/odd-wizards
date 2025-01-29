"use client"

import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react"
import { DataTablePagination } from "./pagination-tables";

interface DataTableProps<TData, TValue> {
  sortingValue?: string,
  searchValue?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number,
  page?: number,
  per_page?: number,
  setPage?: React.Dispatch<React.SetStateAction<number>>,
  setPageLimit?: React.Dispatch<React.SetStateAction<number>>,
  onPageChange?: (page: number) => void,
  onPerPageChange?: (perPage: number) => void,
  onSortingChange?: (sorting: string) => void,
}

export function DataTable<TData, TValue>({
  sortingValue,
  searchValue,
  columns,
  data,
  pageCount,
  page = 1,
  per_page = 10,
  onPageChange,
  onPerPageChange,
  onSortingChange,
}: DataTableProps<TData, TValue>) {

  // handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: per_page,
    })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  // Update pagination when props change
  React.useEffect(() => {
    setPagination({
      pageIndex: page - 1,
      pageSize: per_page,
    })
  }, [page, per_page])

  // Notify parent components of pagination changes
  React.useEffect(() => {
    if (onPageChange) {
      onPageChange(pageIndex + 1)
    }
    if (onPerPageChange) {
      onPerPageChange(pageSize)
    }
  }, [pageIndex, pageSize, onPageChange, onPerPageChange])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  // Handle search and sorting
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    
    if (onSortingChange && sortingValue) {
      onSortingChange(sortingValue);
    }
  }, [searchValue, sortingValue, onSortingChange])

  return (
    <div className="rounded-md bg-background p-4 border">
      <div className="h-full grid overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}