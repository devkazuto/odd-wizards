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
            <div className="bg-black w-full h-screen relative">
                <div className="absolute top-0 w-full h-[250px] bg-gradient-to-b from-black to-transparent z-10" />
                <div className="absolute bottom-0 w-full h-[250px] bg-gradient-to-b from-transparent to-black z-10" />
                <div className="absolute top-0 left-0 right-0 bottom-0 ">
                    <video autoPlay loop muted className="w-full scale-125">
                        <source src="/images/stake/banner-odds.mp4" type="video/mp4" />
                        <img src="/images/stake/banner-odds.png" className="w-full" />
                    </video>
                </div>
                <div className="bg-[url('/images/wizard.gif')] bg-cover bg-center w-[150px] h-[150px] absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full z-20" />
            </div>
            <div className="flex flex-col items-center justify-center mt-8 px-20">
                <CustomGradualSpacing
                    className="font-display text-center text-4xl md:!text-6xl font-black md:leading-[5rem]"
                    text="Odds Wizard"
                />
                <div className="my-8">
                    <p className="text-sm md:!text-xl text-gray-400 leading-none">Bad kids is a collection of 9,999 bad drawings of kids. Some people like the pictures and some people are bad kids themselves. You can buy them if you want to or you can just look at them, that’s ok too.</p>
                </div>
            </div>
            <div className="w-full h-[125px] bg-black" />
            <div>
                <StakeSection collection={params.collection} />
            </div>
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
