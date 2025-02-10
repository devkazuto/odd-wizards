'use client';
import Autoplay from "embla-carousel-autoplay";
import { EmblaOptionsType } from "embla-carousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BannerProps = {
    items: any[]
}

const Banner = ({ items }: BannerProps) => {

    const OPTIONS: EmblaOptionsType = { loop: true };
    const plugin = React.useRef(Autoplay({ delay: 10000, stopOnInteraction: false }));

    return <div className="w-full h-full rounded-[30px]">
        <Carousel
            opts={OPTIONS}
            plugins={[plugin.current]}
            className="w-full h-full rounded-[30px]"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="w-full h-full -ml-2 rounded-[30px]">
                {/* {items?.map((item, index) => ( */}
                <CarouselItem >
                    <div className="relative w-full h-full">
                        <Image
                            layout="fill"
                            objectFit="cover"
                            src="/images/Odds-Garden.png"
                            alt=""
                            className="rounded-[30px]"
                        />
                        <div className="absolute bottom-0 left-0 z-5 bg-gradient-to-b from-transparent via-black-75 to-black w-full p-10 pb-18 pl-16">
                            <div className="flex gap-2">
                                <Link href="#">
                                    <img src="/images/x.png" className="h-[35px]" />
                                </Link>
                                <Link href="#">
                                    <img src="/images/discord.png" className="h-[35px]" />
                                </Link>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <div className={cn("w-6 h-6 flex items-center justify-center rounded-full blinker bg-green-500/50")}>
                                            <div className={cn("w-4 h-4 rounded-full bg-green-500")} />
                                        </div>
                                        <h1 className="text-2xl font-black">111 Seals Minted</h1>
                                    </div>
                                    <span className="opacity-70 text-lg font-bold">Whitelist phase 1 ends in 12h 29m 22s</span>
                                </div>
                                <Button className="h-12 px-8 rounded-[10px] text-lg bg-white text-black font-black hover:bg-white">Go to Launchpad</Button>
                            </div>
                        </div>
                        {/* <div className="absolute bottom-10 right-10 z-5">
                                <Button>Go to launchpad</Button>
                            </div> */}
                    </div>
                </CarouselItem>
                {/* ))} */}
            </CarouselContent>
            <CarouselPrevious className="left-5 absolute z-15 bg-black bg-opacity-50 border-0 h-10 w-10 hover:bg-black hover:bg-opacity-75" />
            <CarouselNext className="right-5 z-15 bg-black bg-opacity-50 border-0 h-10 w-10 hover:bg-black hover:bg-opacity-75" />
        </Carousel>
    </div>;
}

export default Banner;