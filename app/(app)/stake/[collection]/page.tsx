"use client"
import Header from "@/components/layout/header";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import StakeSection from "@/components/home/StakeSection";
export default function Stake({ params }: { params: { collection: string } }) {

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div className="bg-black w-full h-[175px] md:h-full relative">
                <div className="absolute top-0 w-full h-[100px] md:h-[250px] bg-gradient-to-b from-black to-transparent z-10" />
                <div className="absolute bottom-0 w-full h-[100px] md:h-[250px] bg-gradient-to-b from-transparent to-black z-10" />
                {/* <div className="absolute top-0 left-0 right-0 bottom-0 "> */}
                    <video autoPlay loop muted className="w-full h-full scale-150 md:scale-100">
                        <source src="/images/stake/banner-odds.mp4" type="video/mp4" />
                        <img src="/images/stake/banner-odds.png" className="w-full" />
                    </video>
                {/* </div> */}
                <div className="bg-[url('/images/wizard.gif')] bg-cover bg-center w-[100px] h-[100px] md:w-[175px] md:h-[175px] absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full z-20" />
            </div>
            <div className="flex flex-col items-center justify-center mt-8 px-5 md:px-20">
                <CustomGradualSpacing
                    className="font-display text-center text-4xl md:!text-6xl font-black md:leading-[5rem]"
                    text="Odds Wizard"
                />
                <div className="my-8 px-5 md:px-32">
                    <p className="text-sm md:!text-xl text-gray-400 leading-none text-center">Dive into the magic of Odds World, a mystical spot where rebellious yet big-hearted and passionate wizards hang out in the Cosmos. They&apos;re all about critical thinking and are super driven to succeed.</p>
                </div>
            </div>
            {/* <div className="w-full h-[150px] bg-black" /> */}
            <div className="relative">
                <StakeSection collection={params.collection} />
            </div>
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
