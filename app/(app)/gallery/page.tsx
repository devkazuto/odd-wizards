"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CollectionCard, { CollectionCardType } from "@/components/CollectionCard";
import TabsGallery from "@/components/TabsGallery";
import { useState } from "react";
import GenerateImage from "@/components/gallery/GenerateImage";
import TabsGalleryMobile from "@/components/TabsGalleryMobile";
import Marquee from "react-fast-marquee";
import Snowfall from 'react-snowfall';
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import Link from "next/link";

const collections: CollectionCardType[] = [
    {
        id: "rebbits",
        address: "stars12se30zklzhjf84ky669lrtx0wdlsk92lg4nad7yufk9d8qp08n2q8m58cw",
        image: "/images/Rebbits.png",
        imageGif: "/images/Rebbits.gif",
        name: "Rebbits",
        link: "https://www.stargaze.zone/m/rebbits/tokens"
    },
    {
        id: "oddswizard",
        address: "stars1vjxr6hlkjkh0z5u9cnktftdqe8trhu4agcc0p7my4pejfffdsl5sd442c7",
        image: "/images/Odds-Wizard.png",
        imageGif: "/images/Odds-Wizard.gif",
        name: "Odds Wizard",
        link: "https://www.stargaze.zone/m/oddswizard/tokens"
    },
    {
        id: "steamland",
        address: "stars1jf25kwveccgyp0cz5ae5wyvve8m8j8qpyr0mvul2t09e84yrplvscef9xa",
        image: "/images/Steamland.png",
        imageGif: "/images/Steamland.gif",
        name: "Steamland",
        link: "https://www.stargaze.zone/m/steamland/tokens"
    },
    {
        id: "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420",
        address: "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420",
        image: "/images/Bad-kids.png",
        imageGif: "/images/Bad-kids.gif",
        name: "Bad Kids",
        link: "https://www.stargaze.zone/m/stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420/tokens"
    }
]

const tabs = [
    { id: "rebbits", icon: '/images/Rebbits.png', label: "Rebbits" },
    { id: "odds-wizard", icon: '/images/wizard-crown.png', label: "Odds Wizard" },
];


export default function Gallery() {

    const [activeTab, setActiveTab] = useState<string>("rebbits");

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div className="min-h-screen flex flex-col  items-center justify-center pt-28">
                <div className="flex flex-col items-center justify-center mt-6 mb-10 px-20">
                    <CustomGradualSpacing
                        className="font-display text-center text-[27px] md:!text-6xl font-black md:leading-[5rem]"
                        text="Make NFTs Great Again!"
                    />
                    <div className="mt-4 px-10 md:!px-40">
                        <p className="text-sm md:!text-xl text-gray-400 leading-none text-center">The next Blue chip on Internet, powered by <Link href="https://www.stargaze.zone" className="text-[#DB2877]" >Stargaze.</Link></p>
                    </div>
                </div>
                {/* <div className="grid grid-cols-1 md:!grid-cols-3 w-full px-10 md:!px-28"> */}
                <Marquee speed={100}>
                    {[...collections, ...collections].map((item, index) => (
                        <div key={index} className="flex justify-center items-center">
                            <CollectionCard
                                key={index}
                                data={item}
                                index={index}
                            />
                        </div>
                    ))}
                </Marquee>

                {/* </div> */}
            </div>
            {/* <div className="mt-8 md:!my-20 text-center">
                <h1 className="text-2xl md:!text-6xl text-white font-black">Create something fun!</h1>
                <div className="mt-2 md:!mt-6">
                    <p className="text-sm md:!text-3xl text-gray-400 leading-tight">Click “random” for unlimited possibilities.</p>
                </div>
            </div>
            <div className="w-full">
                <div className="hidden md:!block">
                    <TabsGallery tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="md:!hidden">
                    <TabsGalleryMobile tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <GenerateImage collection={activeTab} />
            </div> */}
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-16">
                <Footer className="my-0" />
            </div>
        </div>
    );
}
