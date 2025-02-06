import Link from "next/link";
import { useState } from "react";
import InfoModal from "@/components/modal/info-modal";

const CollectionCard = () => {

    const [infoModal, setInfoModal] = useState<boolean>(false);

    return (
        <div className="w-full bg-[url('/images/Account.gif')] bg-cover bg-center border border-[#323237] p-4 md:px-12 md:p-8 rounded-[50px] flex items-center gap-x-4">
            <InfoModal isOpen={infoModal} onClose={() => { setInfoModal(false) }} loading={false} />
            <img src="https://ipfs-gw.stargaze-apis.com/ipfs/bafybeidhudswmq6jlu54ixz45rsdbncrj62hx5paz2pdil52q7jtilqdvu/IMG_7278.gif" className="shrink-0 h-[105px] md:!h-[175px] rounded-[35px] mx-auto" />
            <div className="w-full p-2 md:p-4">
                <div className="text-center md:flex md:text-start justify-between mb-2">
                    <Link href="https://www.stargaze.zone/m/oddswizard/tokens" target="_blank" className="w-full flex items-center justify-between gap-x-4">
                        <h1 className="text-white text-[20px] md:text-3xl font-semibold">Odds Wizard 🧙‍♂️</h1>
                        {/* <span className="text-white text-sm md:!text-lg font-semibold">Trade collection</span> */}
                        <img src="/images/Icon/stargaze.png" className="w-[25px] md:!w-[40px]" />
                    </Link>
                </div>
                <div className="flex gap-x-1">
                    <p className="text-xs md:!text-lg text-gray-400 leading-tight line-clamp-1">ODDS is a mystical garden where the most peculiar beings gather and play within the Cosmos. Starting with the Odds Wizard, the first entity to step into the ODDS, paving the way for an ever-growing collection of oddities, waiting to be discovered.</p>
                    <span className="cursor-pointer text-green-500" onClick={() => { setInfoModal(true) }}>more</span>
                </div>
                <div className="relative mx-auto mt-4 md:!mx-0 md:!mt-4">
                    
                </div>
            </div>
        </div>
    )
}

export default CollectionCard;