"use client";
import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";
import Snowfall from 'react-snowfall';


export default function About() {
    return (
        <div className="relative w-full bg-[url('/images/About.gif')] bg-cover bg-center">
            <div className="p-4 md:!p-8 h-[calc(100vh-150px)] ">
                <div className="bg-black/40 absolute top-0 left-0 right-0 bottom-0 z-0" />
                <Header />
                <div className="relative h-full flex items-center justify-center">
                    {/* <img src="/images/about.gif" className="absolute top-0 z-0 w-full" /> */}
                    <div className="text-center w-full px-10 md:!px-40 mt-20 md:!mt-28">
                        <div className="hidden md:!flex justify-center relative text-xl md:text-3xl font-bold my-6 text-center">
                            There is no challenge right now, stay tuned
                        </div>
                        <div className="relative text-xl md:hidden font-bold text-center">
                            There is no challenge
                        </div>
                        <div className="relative text-xl md:hidden font-bold text-center">
                            right now, stay tuned!
                        </div>
                    </div>
                </div>
            </div>
            <Footer className="my-0 md:!my-0 py-8" />
        </div>
    );
}
