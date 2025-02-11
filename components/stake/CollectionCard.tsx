import Link from "next/link";
import { useState } from "react";
import InfoModal from "@/components/modal/info-modal";
import { Button } from "../ui/button";
import { mst_collection } from "@prisma/client";

export interface CollectionCardProps {
    collection: mst_collection
}

const CollectionCard = ({
    collection
}: CollectionCardProps) => {

    const [infoModal, setInfoModal] = useState<boolean>(false);

    return (
        <div className="w-full bg-[#171717] border border-[#323237] p-4 md:px-8 md:p-6 rounded-[50px] flex items-center gap-x-4">
            <InfoModal collection={collection} isOpen={infoModal} onClose={() => { setInfoModal(false) }} loading={false} />
            <img src={collection?.collection_image_url ?? ""} className="shrink-0 w-[80px] h-[80px] md:!h-[125px] md:!w-[125px] object-cover bg-center rounded-[35px] mx-auto" />
            <div className="w-full p-2 md:p-4">
                <div className="text-center md:flex md:text-start justify-between mb-2">
                    <Link href={`https://www.stargaze.zone/m/${collection.collection_address}/tokens`} target="_blank" className="w-full flex items-center justify-between gap-x-4">
                        <h1 className="text-white text-[20px] md:text-2xl font-semibold">{collection.collection_name}</h1>
                    </Link>
                </div>
                <div className="flex gap-x-1">
                    <p className="text-xs md:!text-base text-gray-400 leading-tight line-clamp-1">{collection.collection_description}</p>
                    <span className="cursor-pointer text-green-500" onClick={() => { setInfoModal(true) }}>more</span>
                </div>
                <div className="flex items-center gap-x-4 mx-auto mt-4 md:!mx-0 md:!mt-4">
                    <Link href={`https://www.stargaze.zone/m/${collection.collection_address}/tokens`} className="w-full">
                        <Button variant={"secondary"} className="rounded-[10px] text-lg w-full h-10">
                            Trade
                        </Button>
                    </Link>
                    <Button onClick={() => { setInfoModal(true) }} variant={"secondary"} className="rounded-[10px] text-lg w-full h-10">
                        Detail
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CollectionCard;