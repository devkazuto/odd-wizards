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
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { DataTablePagination } from "./pagination-tables";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableProps<TData, TValue> {
  sortingValue?: string,
  searchValue?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number,
  setPage?: React.Dispatch<React.SetStateAction<number>>,
  setPageLimit?: React.Dispatch<React.SetStateAction<number>>,
}

export function DataTable<TData, TValue>({
  sortingValue,
  searchValue,
  columns,
  data,
  pageCount,
  setPage,
  setPageLimit,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // search params
  const page = searchParams?.get("page") ?? "1" // default is page: 1
  const per_page = searchParams?.get("per_page") ?? "10" // default 10 record per page

  // create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  // handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  React.useEffect(() => {
    setPagination({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    })
  }, [page, per_page])

   // changed the route as well
  React.useEffect(() => {
    if(setPage && setPageLimit){
      setPage(pageIndex + 1)
      setPageLimit(pageSize)
    } else {
      router.push(
        `${pathname}?${createQueryString({
          page: pageIndex + 1,
          per_page: pageSize,
        })}`
      )
    }

  }, [pageIndex, pageSize])

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

  React.useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: searchValue,
          sorting: sortingValue ?? null,
        })}`,
        {
          scroll: false
        }
      );
    }
    if (searchValue?.length === 0 || searchValue === undefined) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: null,
          sorting: sortingValue ?? null,
        })}`,
        {
          scroll: false
        }
      );
    }

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue, sortingValue])

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