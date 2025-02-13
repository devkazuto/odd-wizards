"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import Snowfall from 'react-snowfall';
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn, formatAddress, formatDecimal } from "@/lib/utils";
import Link from "next/link";
import getConfig from "@/config/config";
import { useUser } from "@/hooks/useUser";
import RaffleCard from "@/components/raffle/RaffleCard";
import axios, { AxiosError } from "axios";
import NumberTicker from "@/components/ui/number-ticker";
import { Raffle } from "@/types/raflles";
import Loading from "@/components/Loading";
import { useChain } from "@cosmos-kit/react";
import Particles from "@/components/ui/particles";
import RaffleCardCustom from "@/components/raffle/RaffleCardCustom";
import { AnimatedList } from "@/components/ui/animated-list";
import { Item, Notification } from "@/components/Notification";
import { mst_project } from "@prisma/client";

export default function Stake() {
    const config = getConfig();
    const { user, staker } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [history, setHistory] = useState<Item[]>([]);
    const [page, setPage] = useState<number>(1);
    const [stakers, setStakers] = useState<any>();
    const [tokens, setTokens] = useState<any[] | []>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { address } = useChain("stargaze");
    const LIMIT = 8;

    const fetchRaffles = async (pageNum: number, append: boolean = false) => {
        try {
            const resp = await axios.get(`/api/raffle/list?page=${pageNum}&limit=${LIMIT}`);
            const { data, pagination } = resp.data;

            if (append) {
                setRaffles(prev => [...prev, ...data]);
            } else {
                setRaffles(data);
            }

            setHasMore(pageNum < pagination.totalPages);
            return data;
        } catch (error) {
            console.error('Error fetching raffles:', error);
            return [];
        }
    };

    const fetchHistory = async () => {
        try {
            const resp = await axios.get(`/api/raffle/history`);
            const { data } = resp.data;
            const notifcations: Item[] = data.map((item: any) => {
                return {
                    name: `Bought Raffle Ticket`,
                    description: `just bought ${item.participant_amount} ticket${item.participant_amount > 1 ? "s" : ""}`,
                    img: item.user.user_image_url,
                    wallet: formatAddress(item.user.user_address),
                    reward: item.raffle.rewards[0]?.reward_name,
                }
            });

            setHistory(notifcations);
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    };

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        await fetchRaffles(nextPage, true);
        setPage(nextPage);
        setLoadingMore(false);
    };

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            await fetchRaffles(1);
            await fetchHistory();
            setLoading(false);
        }
        fetchInitialData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (address) {
                let resp = await axios.get(`/api/user/${address}`);
                const data = resp.data.data;
                setStakers(data.staker);

                setTokens(
                    Object.values(
                        data.staker.filter((item: mst_project) => {
                            return item.project_code == 'oddswizard'
                        }).reduce((acc: any, staker: any) => {
                            const projectId = staker.staker_project_id ?? 0;
                            const project = staker.projects; // Getting the related project data

                            if (!acc[projectId]) {
                                acc[projectId] = {
                                    project_id: projectId,
                                    project_symbol: project?.project_symbol ?? '',
                                    project_symbol_img: project?.project_symbol_img ?? '',
                                    total_nft_staked: 0,
                                    total_points: 0
                                };
                            }

                            acc[projectId].total_nft_staked += staker.staker_nft_staked ?? 0;
                            acc[projectId].total_points += staker.staker_total_points ?? 0;

                            return acc;
                        }, {} as Record<number, {
                            project_id: number;
                            project_symbol: string;
                            project_symbol_img: string;
                            total_nft_staked: number;
                            total_points: number;
                        }>)
                    )
                );

            }
        }

        fetchData();
    }, [address]);

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div>
                <div className="grid">
                    <div className="px-0 mt-16 md:!px-16 md:!mt-16 mx-auto py-4 md:!py-6 gap-x-32 text-left grid md:flex justify-between items-center">
                        <div>
                            <div>
                                <div
                                    className={cn(
                                        "relative flex h-[80px] w-full flex-col overflow-hidden rounded-[10px] md:shadow-xl my-4 px-4"
                                    )}
                                >
                                    <AnimatedList delay={5000}>
                                        {history.map((item, idx) => (
                                            <Notification {...item} key={idx} />
                                        ))}
                                    </AnimatedList>
                                </div>
                            </div>
                            <div className="hidden md:!flex justify-center">
                                <CustomGradualSpacing
                                    className="font-display text-[36px] md:!text-6xl font-black leading-tight md:!leading-[5rem]"
                                    text="Fortune on Your Side"
                                />
                            </div>
                            <div className="grid justify-center md:!hidden">
                                <div className="flex justify-center">
                                    <CustomGradualSpacing
                                        className="font-display text-[36px] md:!text-6xl font-black leading-tight md:!leading-[5rem]"
                                        text="Fortune on"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <CustomGradualSpacing
                                        className="font-display text-[36px] md:!text-6xl font-black leading-tight md:!leading-[5rem]"
                                        text="Your Side"
                                    />
                                </div>
                            </div>
                            <div className="text-center mx-auto hidden md:!block">
                                <p className="text-sm md:!text-xl text-gray-400 leading-tight">Buy as many tickets as possible and win the raffle.</p>
                            </div>
                            <div className="text-center mx-auto md:!hidden">
                                <p className="text-sm md:!text-xl text-gray-400 leading-tight">Buy as many tickets as possible</p>
                                <p className="text-sm md:!text-xl text-gray-400 leading-tight">and win the raffle.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="container">
                    {address && user && (
                        <div className="flex justify-center mt-4 md:!mt-8">
                            <div className="w-full md:!w-[750px]">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    <div className="flex bg-[#18181B] border-2 border-[#323237] flex-grow items-center justify-between p-4 px-8 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:!flex w-[40px] h-[40px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full items-center justify-center">
                                                <Link href={`/p/${user?.user_address}`}>
                                                    <img
                                                        src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                                                        alt={user?.user_address ?? ""}
                                                        className="rounded-full object-cover w-full h-full"
                                                        onError={(e: any) => {
                                                            e.target.src = DEFAULT_IMAGE_PROFILE;
                                                        }}
                                                    />
                                                </Link>
                                            </div>
                                            <div>
                                                <span className="text-[13px] md:text-[20px] text-white">Address</span>
                                                <Link href={`https://www.stargaze.zone/p/${user?.user_address}`} target="_blank" className="text-center text-[#DB2877]">
                                                    <p className="text-[12px] md:text-[20px] font-bold">
                                                        {formatAddress(user?.user_address)}
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-[#18181B] border-2 border-[#323237] flex-grow items-center p-4 px-8 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:flex">
                                                <img src="/images/Icon/wzrd.png" className="h-[35px] md:!h-[55px]" alt="WZRD Token" />
                                            </div>
                                            <div className="block">
                                                <span className="text-[12px] md:text-[20px] text-white">Token</span>
                                                <p className="text-[10px] md:text-[20px] font-bold text-white">
                                                    {formatDecimal(staker?.staker_total_points ?? 0, 2)} $WZRD
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-8 md:!mt-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 md:gap-8 lg:gap-10">
                            {raffles.map((item, index) => (
                                <div key={index} className="my-4">
                                    <div key={item.raffle_id} className={cn(((index + 1) % 4 === 2 || (index + 1) % 4 === 3) ? "md:!-mt-12" : "")}>
                                        <RaffleCardCustom data={item} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {hasMore && !loading && (
                        <div className="mt-8 mb-4 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                {loadingMore ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
            <Particles
                className="absolute inset-0 z-0"
                quantity={100}
                ease={80}
                color={"#ffffff"}
                refresh
            />
        </div>
    );
}