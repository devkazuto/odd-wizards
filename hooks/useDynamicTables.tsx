'use client';
import { addSearch } from '@/lib/utils';
import { useState, useEffect } from 'react';

export type paramsProps = {
    searchParams: valueParamsProps;
};

export type valueParamsProps = {
    [key: string]: string | string[] | undefined;
};

export function useDynamicTables<T>(searchParams: valueParamsProps | null) {
    const [page, setPage] = useState(Number(searchParams?.page) || 0);
    const [pageLimit, setPageLimit] = useState(Number(searchParams?.limit) || 10);
    const [search, setSearch] = useState<string | undefined>(searchParams?.search as string || '');
    const [sorting, setSorting] = useState<string | undefined>('');
    const [pageCount, setPageCount] = useState<number>(0);
    const [data, setData] = useState<T[]>([]);
    const [ttlRecords, setTtlRecords] = useState<number>(0);
    const params: any = {
        page: page ? page - 1 : 0,
        size: pageLimit,
      };
  
    useEffect(() => {
      // Update the state if searchParams change
      setPage(Number(searchParams?.page) || 0);
      setPageLimit(Number(searchParams?.limit) || 10);
      setSearch(searchParams?.search as string || undefined);
    }, [searchParams]);

    const addFilters = (searchList: any[], column: string, opr1: string, opr2?: string, searchVal?: any) => {
        if(opr2){
            searchList.push(
                addSearch(
                    column,
                    searchVal ?? search,
                    opr1,
                    opr2
                )
            );
        } else {
            searchList.push(
                addSearch(
                    column,
                    searchVal ?? search,
                    opr1
                )
            );
        }
    }

    const addSorting = (sorting: string | undefined, params: any) => {
        if(!sorting) return;
        const sorts = sorting?.split("_");
        const sort = sorts[0];
        const sortType = sorts[1];
      
        params['asc'] = undefined;
        params['desc'] = undefined;
        params[sortType] = sort;
      }
      
  
    return { 
        page, 
        setPage, 
        pageLimit, 
        setPageLimit, 
        search, 
        setSearch, 
        sorting, 
        setSorting,
        pageCount,
        setPageCount,
        ttlRecords,
        setTtlRecords,
        data,
        setData,
        addFilters,
        params,
        addSorting
    };
}