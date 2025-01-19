"use client";
import { formatToStars, getCollection } from "@/lib/utils";
import { CollectionStat } from "@/types/collection-stat";
import axios from "axios";
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import Loading from "./Loading";
import NumberTicker from "./ui/number-ticker";

export interface CollectionCardType {
    id: string
    address?: string
    image: string
    imageGif: string
    name: string
    link: string
}

export interface CollectionCardProps {
    data: CollectionCardType,
    index: number
}

const CollectionCard = ({ data, index }: CollectionCardProps) => {

    const [stat, setStat] = useState<CollectionStat>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // let resp = await axios.get(`/api/collection/stat/${data.id}`);
            let resp = await getCollection(data.id);
            setStat(resp);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center bg-black text-white border border-white group w-[300px] h-[425px] md:!w-[365px] md:!h-[500px]">
            <div className="relative flex justify-center items-center w-[300px] h-[300px] md:!w-[365px] md:!h-[365px] overflow-hidden">
                <Link href={data.link} target="_blank">
                    <div className="absolute top-0 w-full group overflow-hidden">
                        <div className="hidden group-hover:flex justify-between items-center p-2 animate-slide-down group-not-hover:animate-slide-up">
                            <span>Trade Collection</span>
                            <ArrowUpRight />
                        </div>
                    </div>
                    <div className="p-4 group-hover:hidden">
                        <img src={data.image} alt={data.name} className="h-full w-full object-cover" />
                    </div>
                    <img src={data.imageGif} alt={data.name} className="h-full w-full hidden group-hover:flex object-cover" />
                </Link>
            </div>
            <div className="border-y border-white w-full p-4">
                <h2 className="text-xl font-bold truncate">{data.name}</h2>
            </div>
            <div className="grid grid-cols-2 w-full">
                <div className="p-4 border-white w-full">
                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <div>
                                <p className="font-bold">
                                <NumberTicker value={formatToStars(stat?.floor?.amount)} decimalPlaces={2} skipAnimation={true} /> {stat?.floor.symbol}
                                </p>
                                <span>Floor</span>
                            </div>
                        )
                    }
                </div>
                <div className="p-4 border-l border-white w-full">
                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <div>
                                <p className="font-bold">{data.id ? stat?.tokenCounts.listed : 0} NFTs</p>
                                <span>Listing</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );    
}

export default CollectionCard;