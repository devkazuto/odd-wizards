"use client";
import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import Marquee from "react-fast-marquee";
import CollectionCard, { CollectionCardType } from "@/components/CollectionCard";
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


export default function Home() {
  return (
    <div className="relative bg-black w-full overflow-hidden">
      <div className="relative">
        <Header />
        {/* <div className="bg-[url('/images/wizard.gif')] md:!hidden bg-cover bg-center h-[500px] w-full scale-125" /> */}
        <video autoPlay
          loop
          muted
          playsInline className="md:!hidden w-full h-full">
          <source src="/images/mobile-home.mp4" type="video/mp4" />
        </video>
        {/* <img src="/images/wizard.gif" className="md:!hidden h-screen w-full" /> */}
        <video autoPlay
          loop
          muted
          playsInline className="hidden md:!block w-full h-full">
          <source src="/images/Home-Odds.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="flex flex-col items-center justify-center my-10 px-20">
        <CustomGradualSpacing
          className="font-display text-center text-[27px] md:!text-6xl font-black md:leading-[5rem]"
          text="Make NFTs Great Again!"
        />
        <div className="mt-3 px-10 md:!px-40">
          <p className="text-sm md:!text-xl text-gray-400 leading-none text-center">The next Blue chip on Internet, powered by <Link href="https://www.stargaze.zone" className="text-[#DB2877]" >Stargaze.</Link></p>
        </div>
      </div>
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
      <Footer className="my-0" />
    </div>
  );
}