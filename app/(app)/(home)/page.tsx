"use client";
import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import Marquee from "react-fast-marquee";
import CollectionCard, { CollectionCardType } from "@/components/CollectionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, formatAmount } from "@/lib/utils";
import { AvatarCircles } from "@/components/ui/avatas-circle";
import FaqContainer from "@/components/home/FaqContainer";
import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "@/components/home/Banner";

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

  const [banners, setBanners] = useState<any[] | []>([]);
  const [avatars, setAvatars] = useState<any[] | []>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const resp = await axios.get("/api/user/list");
      const { users, total } = resp.data.data;
      setTotal(total);
      setAvatars(users.map((user: any) => {
        return {
          imageUrl: user.user_image_url,
          profileUrl: "/p/" + user.user_address
        }
      }));

      const respBanners = await axios.get("/api/banners");
      setBanners(respBanners.data.data);
    }

    fetchData();
  }, []);

  return (
    <div className="relative bg-black w-full overflow-hidden">
      <div className="relative bg-[url('/images/blur-home.png')] bg-cover bg-center px-10 pt-24">
        <div className="absolute left-0 bottom-0 z-1 w-full h-[100px] bg-gradient-to-b from-transparent to-black/50" />
        <Header />
        {/* <div className="bg-[url('/images/wizard.gif')] md:!hidden bg-cover bg-center h-[500px] w-full scale-125" /> */}
        {/* <video autoPlay
          loop
          muted
          playsInline className="md:!hidden w-full h-full">
          <source src="/images/mobile-home.mp4" type="video/mp4" />
        </video> */}
        {/* <img src="/images/wizard.gif" className="md:!hidden h-screen w-full" /> */}
        {/* <video autoPlay
          loop
          muted
          playsInline className="hidden md:!block w-full h-full">
          <source src="/images/Home-Odds.mp4" type="video/mp4" />
        </video> */}
        <div className="relative h-[calc(100vh-100px)]">
          <Banner items={banners} />
        </div>
        {/* <div className="relative h-screen bg-[url('/images/Odds-Garden.png')] bg-center bg-cover bg-no-repeat rounded-[20px]">
          <div className="absolute bottom-24 w-full px-6">
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
        </div> */}
      </div>
      <div className="flex flex-col items-center justify-center my-10 mt-24 px-20">
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
      <div className="my-28 text-center px-28">
        <div className="group relative h-72 flex items-center justify-center overflow-hidden rounded-3xl">
          {/* Background div that zooms */}
          <div className="absolute inset-0 bg-[url('/images/Epigraph.gif')] bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-110">
          </div>

          {/* Content div that stays static */}
          <div className="relative z-10 max-w-max max-h-max">
            <h1 className="text-center text-5xl font-black">{formatAmount(total)} Odds People!</h1>
            <span className="text-lg text-white">Stay Connected, from all over the world</span>
            <div className="mx-auto mt-4">
              <AvatarCircles
                className="justify-center mx-auto p-4 max-w-max rounded-full"
                numPeople={99}
                avatarUrls={avatars}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-20 px-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
          <div>
            <h1 className="text-3xl text-white font-bold">Challenge</h1>
            <p className="leading-7 text-lg text-gray-500 mt-2">Participate on the Staking Challenge and compete with fellow holders. Climb the leaderboard by staking as much NFTs as you can, track your rank, and win exciting prizes.</p>
            <div className="rounded-[25px] w-full h-[250px] mt-4 overflow-hidden">
              <div className="bg-[url('/images/home/challenge.png')] bg-cover bg-center w-full h-full hover:scale-105 transition-all duration-300 ease-in-out" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl text-white font-bold">Stake</h1>
            <p className="leading-7 text-lg text-gray-500 mt-2">Enhance your NFTs value by staking on Odds Garden, offering you a fresh experience to earn points, use them to try unique features within the website, and gather even more benefits.</p>
            <div className="rounded-[25px] w-full h-[250px] mt-4 overflow-hidden">
              <div className="bg-[url('/images/home/stake.png')] bg-cover bg-center w-full h-full hover:scale-105 transition-all duration-300 ease-in-out" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl text-white font-bold">Raffles</h1>
            <p className="leading-7 text-lg text-gray-500 mt-2">Try your luck on raffle, collect as many tickets as possible for a chance to win valueable NFTs. Don&apos;t forget to check the Raffle page to see the participants and the lucky winners.</p>
            <div className="rounded-[25px] w-full h-[250px] mt-4 overflow-hidden">
              <div className="bg-[url('/images/home/raffle.png')] bg-cover bg-center w-full h-full hover:scale-105 transition-all duration-300 ease-in-out" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl text-white font-bold">Upcoming Features</h1>
            <ul className="list-disc ml-4 mt-2">
              <li className="leading-7 text-lg text-gray-500">Dashboard - Seamless experience.</li>
              <li className="leading-7 text-lg text-gray-500">Games - More fun and rewarding.</li>
              <li className="leading-7 text-lg text-gray-500">Exchange - Convert Odds Points into $STARS/USDC.</li>
            </ul>
            <div className="rounded-[25px] w-full h-[250px] mt-4 overflow-hidden">
              <div className="bg-[url('/images/home/coming-soon.png')] bg-cover bg-center w-full h-full hover:scale-105 transition-all duration-300 ease-in-out" />
            </div>
          </div>
        </div>
        <div className="my-28">
          <h1 className="text-5xl text-center font-black">FAQ</h1>
          <div className="mt-4">
            <FaqContainer number="01" title="What is Odds Garden?">
              <span className="text-xl text-[#A1A1AA]">Odds Garden is a growing and innovative NFTs staking platform, where art, tech, and community unite to unlock endless possibilities, offering bigger opportunities for holders. The future is ODDS, where imagination meets innovation.</span>
            </FaqContainer>
            <FaqContainer number="02" title="What can you do?">
              <span className="text-xl text-[#A1A1AA]">Explore Odds Garden and experience a whole new level of Stake, Raffle, and Challenges like never before. You can participate on competitions, earn exclusive benefits, and discover new possibilities as the world of ODDS continues to expand.</span>
            </FaqContainer>
            <FaqContainer number="03" title="It says &quot;Powered by Stargaze&quot; what&apos;s Stargaze?">
              <div className="grid gap-4">
                <span className="text-xl text-[#A1A1AA]">Stargaze is the only NFT platform that offers minting and trading with ZERO gas. Mint and trade NFTs on the app chain made for NFTs. Secured and governed by $STARS.</span>
                <Link href="https://docs.stargaze.zone/introduction/what-is-stargaze" target="_blank" className="text-xl text-[#DB2877]">Read more about Stargaze</Link>
              </div>
            </FaqContainer>
          </div>
        </div>
      </div>
      <Footer className="my-0" />
    </div>
  );
}