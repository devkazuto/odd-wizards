"use client";

import getConfig from "@/config/config";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn, formatAddress, formatDecimal } from "@/lib/utils";
import { LeaderboardItem } from "@/types/leaderboard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useClaim } from "@/hooks/useClaim";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { mst_project } from "@prisma/client";

export interface LeaderboardProps {
  project: mst_project
}

const Leaderboard = ({
  project
}: LeaderboardProps) => {
  const rankEmojis = ["🥇", "🥈", "🥉"];

  // const [visibleItems, setVisibleItems] = useState(4); // Jumlah item yang ditampilkan
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]); // Data leaderboard
  const [page, setPage] = useState(0); // Halaman untuk pagination
  const [hasMore, setHasMore] = useState(true); // Menandakan apakah masih ada data untuk dimuat
  const [loading, setLoading] = useState<boolean>(false);
  const config = getConfig();
  const { claim } = useClaim();

  // Fungsi untuk mengambil data leaderboard
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    async function fetchData() {
      setLoading(true);
      try {
        const resp = await axios.get(`/api/soft-staking/leaderboard?collection_address=${config?.collection_address}&page=${page}`, {
          signal,
        });
        const data = resp.data.data ?? [];
        setLeaderboard((prev) => [...prev, ...data]); // Menambahkan data baru ke data yang sudah ada
        setHasMore(data.length > 0); // Jika tidak ada data, set hasMore ke false
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching leaderboard data:", error);
        }
      }
      setLoading(false);
    }
  
    fetchData();
  
    return () => {
      controller.abort(); // Membatalkan request saat komponen dibersihkan
    };
  }, [page]);
  

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setPage(0);
      try {
        const resp = await axios.get(`/api/soft-staking/leaderboard?collection_address=${config?.collection_address}&page=0`);
        const data = resp.data.data ?? [];
        setLeaderboard(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [claim]);

  // Fungsi untuk memuat lebih banyak data
  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Naikkan halaman saat tombol "Load More" diklik
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 md:!py-12 px-4">
      <h1 className="text-2xl md:!text-4xl font-bold mb-2 text-white text-center">
        Leaderboard
      </h1>
      <p className="flex text-xs md:!text-lg text-gray-400 text-center leading-tight">
        Stake your Wizard, rise to the top, <span className="hidden md:!flex mx-2">and show off your Odds collection.</span>
      </p>
      <p className="md:!hidden text-xs md:!text-lg text-gray-400 text-center leading-tight">
        and show off your Odds collection.
      </p>
      <div className="flex flex-col items-center w-full mt-4">
        {leaderboard.map((item, index) => (
          <div
            key={index}
            className="flex gap-2 md:!gap-6 items-center justify-center w-full mt-2 px-0 md:px-12 lg:px-16"
          >
            <div className={cn(rankEmojis[item.ranking - 1] ? "text-xl md:!text-4xl" : "text-sm md:!text-xl", "flex items-center justify-center w-[60px] h-[68px] md:w-[105px] md:h-[105px] bg-neutral-900 border border-[#323237] rounded-[15px] md:rounded-[25px] text-[#A1A1AA] font-bold text-center p-4")}>
              {rankEmojis[item.ranking - 1] || item.ranking}
            </div>
            <div className="grid grid-cols-3 p-4 px-4 md:!px-8 gap-2 w-full h-[68px]  md:h-[105px] md:w-full bg-neutral-900 border border-[#323237] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div className="flex items-center gap-4 col-span-2 md:col-span-1">
                <div className="shrink-0 w-[35px] h-[35px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center overflow-hidden">
                  <Link href={`/p/${item?.staker_address}`} >
                    <img
                      src={item?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                      alt={item?.staker_address ?? ""}
                      className="rounded-full object-cover w-full h-full hover:scale-105"
                      onError={(e: any) => {
                        e.target.src = DEFAULT_IMAGE_PROFILE;
                      }}
                    />
                  </Link>
                </div>
                <div>
                  <Link href={`https://www.stargaze.zone/p/${item?.staker_address}`} target="_blank" className="text-left text-[#DB2877]">
                    <p className="text-[12px] md:text-[20px] font-bold ">
                      {formatAddress(item?.staker_address)}
                    </p>
                  </Link>
                  <div className="text-left md:!hidden text-white">
                    <p className="text-[12px] md:text-[20px] font-bold">{formatDecimal(item.total_points, 2)} ${project.project_symbol}</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:!flex items-center justify-end text-center">
                <p className="text-[10px] md:text-[20px] font-bold">
                  {formatDecimal(item.total_points, 2)} ${project.project_symbol}
                </p>
              </div>
              <div className="flex items-center justify-end text-center">
                <div className="flex items-center justify-between gap-x-2">
                  <div className="w-full">
                    <p className="text-[12px] hidden md:!block md:text-[20px] font-bold">
                      {item.staker_nft_staked} NFTs Staked
                    </p>
                    <div className="md:!hidden">
                      <p className="text-[12px] md:text-[20px] font-bold">{item?.staker_nft_staked} NFTs</p>
                      <p className="text-[12px] md:text-[20px] font-bold">Staked</p>
                    </div>
                  </div>
                  <div hidden={item.staker_red_flag != 'Y'}>
                    <div data-tooltip-id="flag-tooltip" className="flex items-center gap-2" data-tip="This account may be detected manipulating data, we will temporarily flag this account.">
                      <img src="/images/Icon/red-flag.png" className="h-[30px] md:!h-[40px]" />
                    </div>
                    <Tooltip
                      id="flag-tooltip"
                      place="top-end"
                      style={{ backgroundColor: "#B70A0B", color: "#FFF", borderRadius: '10px' }}
                    >
                      <div className="gird">
                        <p className="text-xs">
                          This account may be detected manipulating data,
                        </p>
                        <p className="text-xs">
                          we will temporarily flag this account.
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {
        loading && (
          <div className="my-6 text-center flex items-center justify-center">
            <Loading />
          </div>
        )
      }
      {hasMore && !loading && (
        <div className="mt-5 text-center">
          <button
            onClick={loadMore}
            className="text-[13px] md:!text-xl text-gray-400 hover:text-white"
          >
            Load More ...
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
