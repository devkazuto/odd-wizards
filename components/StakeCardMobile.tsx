"use client";

import { FC, useEffect, useRef, useState } from "react";
import StakeButton from "@/components/StakeButton";
import { WalletStatus } from '@cosmos-kit/core';
import { useChain, useWallet } from "@cosmos-kit/react";
import ConnectButton from "@/components/ConnectButton";
import axios, { AxiosError } from "axios";
import getConfig from "@/config/config";
import { mst_staker } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { promiseToast, useToast } from "./ui/use-toast";
import { useClaim } from "@/hooks/useClaim";
import Link from "next/link";
import confetti from "canvas-confetti";
import { BorderBeam } from "./ui/border-beam";

const StakeCardMobile: FC = () => {

    const [staker, setStaker] = useState<mst_staker | undefined>(undefined);
    const [isFetch, setIsFetch] = useState<boolean>(false);
    // const [point, setPoints] = useState<number>(0);
    const config = getConfig();
    const wallet = useWallet();
    const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
    const { toast } = useToast();
    const { claim, setClaim } = useClaim();
    const claimRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsFetch(false);
        async function fetchData() {
            try {
                let resp = await axios.get(`/api/soft-staking/point?wallet_address=${address}&collection_address=${config?.collection_address}`)
                let data = resp.data.data;
                // setPoints(data.points);
                setStaker(data.staker);
            } catch (error: AxiosError | any) {
            }
            setIsFetch(true);
        }

        if (wallet.status == WalletStatus.Connected && address) {
            fetchData();
        }


    }, [address, claim]);

    const doStakeAndClaim = async () => {
        try {
            setClaim(false);
            promiseToast(axios.post("/api/soft-staking/claim", {
                staker_address: address,
                collection_address: config?.collection_address
            }), {
                loading: {
                    title: "Processing...",
                    description: "Please Wait"
                },
                success: (result) => {
                    setClaim(true);
                    showConfeti();
                    return {
                        title: "Success!",
                        description: "Stake and Claim Successfully"
                    };
                },
                error: (error: AxiosError | any) => ({
                    title: "Ups! Something wrong.",
                    description: error?.response?.data?.message || 'Internal server error.'
                })
            });

        } catch (error: AxiosError | any) {
            toast({
                variant: 'destructive',
                title: 'Ups! Something wrong.',
                description: error?.response?.data?.message || 'Internal server error.'
            });
        }
    }

    const showConfeti = () => {
        const defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
        };

        const shoot = () => {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ["star"],
            });

            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ["circle"],
            });
        };

        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
    }

    return (
        <div className="w-full bg-[#18181B] border border-[#323237] p-4 py-6 md:p-8 rounded-[25px]">
            <div className="flex items-center gap-x-4">
                <img src="/images/stake-wizard.gif" className="shrink-0 h-[105px] md:!h-[175px] rounded-[35px] mx-auto" />
                <div className="w-full p-2 md:p-4">
                    <div className="text-center md:flex md:text-start justify-between mb-2">
                        <Link href="https://www.stargaze.zone/m/oddswizard/tokens" target="_blank" className="w-full flex items-center justify-between gap-x-4">
                            <h1 className="text-white text-xl font-semibold">Odd Wizard</h1>
                            <img src="/images/Icon/stargaze.png" className="w-[25px] md:!w-[40px]" />
                        </Link>
                    </div>
                    <p className="text-xs md:!text-lg text-gray-400 leading-tight line-clamp-2">Each NFT represents a unique wizard, crafted to guide and assist you in exploring the cosmos.</p>
                </div>
            </div>
            <div className="relative w-full mx-auto mt-4 md:!mx-0 md:!mt-2">
                {
                    wallet.status != WalletStatus.Connected ? (
                        <div className="">
                            <ConnectButton className="w-full rounded-2xl" />
                        </div>
                    ) : (
                        isFetch ? (<div className="">
                            {
                                staker ?
                                    (<Button
                                        disabled={!isFetch}
                                        ref={claimRef}
                                        variant={"ghost"}
                                        onClick={doStakeAndClaim}
                                        className="w-full px-8 py-3 h-max text-xs md:!text-xl font-black text-black rounded-2xl bg-green-500 hover:bg-green-600 hover:text-black"
                                    >Stake and Claim</Button>) :
                                    (<StakeButton />)
                            }
                        </div>) : (
                            <Button
                                variant={"ghost"}
                                disabled={true}
                                className="w-full px-8 py-3 h-max text-xs md:!text-xl font-black text-black rounded-2xl bg-green-500 hover:bg-green-600 hover:text-black"
                            > <svg
                                className="animate-spin h-5 w-5 mr-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="black" /* Menentukan warna hitam */
                            >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="black" /* Memberikan warna hitam */
                                        d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg> Please Wait</Button>
                        )
                    )
                }
            </div>
            <BorderBeam size={250} duration={12} delay={9} colorFrom="#49ED4A" colorTo="#98EF98" />
        </div>

    );
};

export default StakeCardMobile;
