"use client";
import getConfig from "@/config/config";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn, formatAddress, formatDecimal, formatToStars } from "@/lib/utils";
import { LeaderboardItem } from "@/types/leaderboard";
import { useChain } from "@cosmos-kit/react";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useClaim } from "@/hooks/useClaim";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { useUser } from "@/hooks/useUser";
import { mst_project } from "@prisma/client";

export interface BoxStatStakeProps {
    collection: string,
    project: mst_project
}

export const BoxStatStake = ({
    collection,
    project
}: BoxStatStakeProps) => {

  const rankEmojis = ["🥇", "🥈", "🥉"];
  const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
  const [stat, setStat] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser(); 
  const { claim } = useClaim();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resp = await axios.get(`/api/soft-staking/point?wallet_address=${address}&collection_address=${collection}`);
        setStat(resp.data.data);
      } catch (error) {
      }
      setLoading(false);
    }

    if (address) {
      fetchData();
    }
  }, [address, claim]);

  return (
    <div hidden={!address}>
      <div hidden={loading}>
        <div className="relative flex gap-2 md:!gap-6 w-full px-6 md:!px-20 lg:px-20">
          <div className="w-full grid md:grid-cols-3 gap-x-4">
            <div className="flex bg-[url('/images/Cosmos.gif')] bg-cover bg-center border-2 border-green-500 flex-grow items-center justify-between p-4 px-8 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                <div className="w-[40px] h-[40px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center overflow-hidden">
                  <Link href={`/p/${address}`} >
                    <img
                      src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                      alt={address ?? ""}
                      className="rounded-full object-cover w-full h-full hover:scale-105"
                      onError={(e: any) => {
                        e.target.src = DEFAULT_IMAGE_PROFILE;
                      }}
                    />
                  </Link>
                </div>
                <div>
                  <span className="text-[13px] md:text-[20px] text-white">Address</span>
                  <Link href={`https://www.stargaze.zone/p/${address}`} target="_blank" className="text-center text-[#DB2877]">
                    <p className="text-[12px] md:text-[20px] font-bold ">
                      {formatAddress(address)}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:!flex bg-[url('/images/About.gif')] bg-cover bg-center border-2 border-green-500 flex-grow items-center p-4 px-8 gap-6 w-[60px] h-[68px] md:w-[105px] md:h-[105px] md:w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div>
                <img src="/images/Icon/wzrd.png" className="h-[55px]" />
              </div>
              <div className="hidden md:!block">
                <span className="text-[12px] md:text-[20px] text-white">Token</span>
                <p className="text-[10px] md:text-[20px] font-bold text-white">
                  {/* <NumberTicker value={leaderboard?.point ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                  {formatDecimal(stat?.point ?? 0, 2)} ${project?.project_symbol}
                </p>
              </div>
            </div>
            <div className="hidden md:!flex  bg-[url('/images/Lab.gif')] bg-cover bg-center border-2 border-green-500 flex-grow items-center p-4 px-8 gap-8 w-[60px] h-[68px] md:w-[105px] md:h-[105px] md:w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div className="text-6xl">
                <img src="/images/Token.png" className="h-[50px]" />
              </div>
              <div className="text-left">
                <span className="text-[12px] md:text-[20px] text-white">NFT</span>
                <p className="text-[12px] text-white hidden md:!block md:text-[20px] font-bold">
                  {/* <NumberTicker value={leaderboard?.totalStake ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                  {formatDecimal(stat?.totalStake ?? 0, 2)} Staked
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={cn("w-full grid grid-cols-2 md:!hidden px-6 gap-x-2 mt-2")}>
          <div className="flex bg-[url('/images/About.gif')] border-2 border-green-500 flex-grow items-center justify-center p-4 px-8 gap-6 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
            {/* <div>
              <img src="/images/Icon/wzrd.png" className="shrink-0 h-[40px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] md:text-[20px] text-white">Token</span>
              <p className="text-[13px] md:text-[20px] font-bold text-white">
                {/* <NumberTicker value={leaderboard?.point ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                {formatDecimal(stat?.point ?? 0, 2)} ${project.project_symbol}
              </p>
            </div>
          </div>
          <div className="flex  bg-[url('/images/Lab.gif')] bg-cover bg-center border-2 border-green-500 bg-cover bg-center flex-grow items-center justify-center p-4 px-8 gap-8 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
            {/* <div className="text-6xl">
              <img src="/images/Token.png" className="shrink-0 h-[35px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] md:text-[20px] text-white">NFT</span>
              <p className="text-[13px] text-white md:text-[20px] font-bold">
                {/* <NumberTicker value={leaderboard?.totalStake ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                {formatDecimal(stat?.totalStake ?? 0, 2)} Staked
              </p>
            </div>
          </div>
        </div>
      </div>
      {
        loading && (
          <div className="my-6 text-center flex items-center justify-center">
            <Loading />
          </div>
        )
      }
    </div>
  );
};
