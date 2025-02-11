'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import { formatAddress } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import { mst_collection } from '@prisma/client';
import moment from 'moment';

interface AlertModalProps {
    collection: mst_collection;
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export default function InfoModal({
    collection,
    isOpen,
    onClose,
    loading
}: AlertModalProps) {

    const { toast } = useToast();

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);

            toast({
                title: 'Success',
                variant: 'success',
                description: 'Address has been copied to clipboard'
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Failed to copy Address to clipboard'
            });
        }
    }

    const formatCreatedDate = (date: Date | undefined | null) => {
        if(!date) return "";
        const momentDate = moment(date);
        return momentDate.format('MMMM D, YYYY h:mm A');
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95%] md:!max-w-xl rounded-xl bg-black">
                {/* <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader> */}
                <div className="w-full bg-black text-white">
                    <span className='font-bold text-xl'>{collection?.collection_name}</span>
                    <p className='text-gray-400 text-xs md:!text-base mt-2'>{collection?.collection_description}</p>
                    <Separator className="my-4" />
                    <div className='flex justify-between my-2 text-gray-400 text-xs md:!text-base'>
                        <span>Contract Address:</span>
                        <div className='flex gap-x-1 items-center text-xs md:!text-base'>
                            <span>{formatAddress(collection?.collection_address ?? "")}</span>
                            <span onClick={() => { handleCopy(collection.collection_address ?? "")}} className='cursor-pointer'><Copy size={16} /></span>
                        </div>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400 text-xs md:!text-base'>
                        <span>Creator:</span>
                        <div className='flex gap-x-1 items-center '>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={`https://www.stargaze.zone/p/${collection.collection_creator_name ?? collection.collection_creator}/tokens`} target='_blank'>
                                            <span className='cursor-pointer text-green-500 text-xs md:!text-base'>{collection.collection_creator_name}</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className='bg-black border border-[#323237] text-xs md:!text-base'>
                                        <p>{formatAddress(collection.collection_creator ?? "")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400 text-xs md:!text-base'>
                        <span>Created:</span>
                        <span>{formatCreatedDate(collection.collection_created_date)}</span>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400 text-xs md:!text-base'>
                        <span>Home chain:</span>
                        <span>{collection.collection_chain}</span>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400 text-xs md:!text-base'>
                        <span>Royalties:</span>
                        <span>{collection.collection_royalties}%</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
