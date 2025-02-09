"use client";
import { useLoading } from '@/hooks/useLoading';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import MorphingText from './ui/morphing-text';
import { usePathname } from 'next/navigation';

const texts = [
    "Loading",
    "Odds Garden"
];


const LoadingPage = () => {

    const { isLoading } = useLoading();
    const path = usePathname();

    console.log("path", path);

    useEffect(() => {
        // console.log("isLoading", isLoading);
    }, [isLoading]);

    return (
        <div>
            {
                (path == "/" || path == "/raffle") && (
                    <div className={cn(isLoading ? "absolute inset-0 flex items-center justify-center bg-black/90 z-[999999]" : "hidden")}>
                        <MorphingText texts={texts} />
                    </div>
                )
            }
        </div>

    );
};

export default LoadingPage;