"use client";

import Link from "next/link";

import { cn, formatAddress } from "@/lib/utils";
import { WalletStatus } from '@cosmos-kit/core';
import { Button } from "@/components/ui/button";
import { Footer } from "./footer";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { useNavbarMobile } from "@/hooks/useNavbarMobile";
import { usePathname } from "next/navigation";
import { useWallet } from "@cosmos-kit/react";
import getConfig from "@/config/config";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { ChevronDownIcon } from "lucide-react";

export default function HeaderMobile() {

    const { connect, disconnect, address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
    const wallet = useWallet();
    const { user, setUser } = useUser();
    const config = getConfig();
    const path = usePathname();
    const { isOpened, setOpen } = useNavbarMobile();
    const [opend, setOpend] = useState<boolean>(isOpened);
    const [stakeOpen, setStakeOpen] = useState<boolean>(false);

    useEffect(() => {

        async function fetchData() {
            if (address) {
                let resp = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
                setUser(resp.data.data);
            }
        }

        fetchData();

    }, [address]);

    useEffect(() => {
        setOpend(isOpened);
    }, [isOpened])

    // Handle connecting the wallet
    const handleConnectWallet = async () => {
        try {
            await connect(); // Connect the wallet
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    // Handle disconnecting the wallet
    const handleDisconnectWallet = async () => {
        try {
            await disconnect(); // Disconnect the wallet
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };

    return (
        <div>
            {/* Mobile Menu */}
            {opend && (
                <div className="absolute z-[999] top-0 left-0 right-0 h-screen bg-[url('/images/About.gif')] bg-cover bg-center py-4 md:hidden">
                    <div className="relative pt-10">
                        <img src={wallet.status == WalletStatus.Connected ? "/images/mobile/goblin.png" : "/images/mobile/goblin-sleep.png"} className="absolute top-24 right-0 w-[155px] pointer-events-none" />
                        <div className="absolute top-0 right-2">
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Open Menu"
                                className="text-white focus:outline-none p-2 rounded-[10px]"
                            >
                                <svg
                                    className="w-6 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M2 22L22 2M2 2l20 20"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col text-center space-y-4">
                            <div className="mx-auto max-w-max transition-transform">
                                {wallet.status != WalletStatus.Connected ? (
                                    <Button
                                        variant="ghost"
                                        className="px-5 py-3 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black hover:animate-shake"
                                        onClick={handleConnectWallet}
                                        aria-label="Connect"
                                    >
                                        <div className="text-xl font-bold flex items-center">
                                            {
                                                wallet.status == WalletStatus.Connecting ? (
                                                    <div className="flex items-center gap-2">
                                                        <svg
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
                                                        </svg>
                                                        Connecting
                                                    </div>
                                                ) : (
                                                    <span>Connect</span>
                                                )
                                            }
                                        </div>
                                    </Button>
                                ) : (
                                    <div className="grid gap-y-3">
                                        <div className="mx-auto w-[75px] h-[75px] rounded-[25px] overflow-hidden">
                                            <Link onClick={() => setOpen(false)} href={`/p/${address}`} >
                                                <img src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE} onError={(e: any) => {
                                                    e.target.src = DEFAULT_IMAGE_PROFILE;
                                                }} className="w-[75px] h-[75px] rounded-[25px] mx-auto hover:scale-105" />
                                            </Link>
                                        </div>
                                        <Button
                                            variant={"ghost"}
                                            className="px-5 py-3 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black hover:animate-shake"
                                            onClick={handleDisconnectWallet}
                                            aria-label={address}
                                        >
                                            <span className="text-xl font-bold">{formatAddress(address)}</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <Link
                                onClick={() => setOpen(false)}
                                href="/about"
                                className={cn("text-xl max-w-max mx-auto font-bold transition-transform", path == "/" || path == "/about" ? "text-white" : "text-gray-200 hover:text-white")}
                            >
                                About
                            </Link>
                            <Link
                                onClick={() => setOpen(false)}
                                href="/gallery"
                                className={cn("text-xl max-w-max mx-auto font-bold transition-transform", path == "/" || path == "/gallery" ? "text-white" : "text-gray-200 hover:text-white")}
                            >
                                Gallery
                            </Link>
                            <div>
                                <div onClick={() => {setStakeOpen(!stakeOpen)}}
                                    className="flex items-center gap-1 max-w-max mx-auto cursor-pointer ">
                                    <span

                                        className={cn("text-xl max-w-max mx-auto font-bold transition-transform", path == "/" || path == "/stake" ? "text-white" : "text-gray-200 hover:text-white")}
                                    >
                                        Stake
                                    </span>
                                    <ChevronDownIcon
                                        className={cn("relative top-[1px] ml-1 h-6 w-6 transition duration-300", stakeOpen && "rotate-180")}
                                        aria-hidden="true"
                                    />
                                </div>
                                <div hidden={!stakeOpen} className="mt-2">
                                    <div className="grid gap-1" >
                                        <Link onClick={() => setOpen(false)} href="/stake/oddswizards" className="font-semibold">
                                            Odd Wizards
                                        </Link>
                                        <span className="opacity-50 font-semibold">Bad Kids (Soon)</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                onClick={() => setOpen(false)}
                                href="/raffle"
                                className={cn("text-xl max-w-max mx-auto font-bold transition-transform", path == "/" || path == "/raffle" ? "text-white" : "text-gray-200 hover:text-white")}
                            >
                                Raffle
                            </Link>
                            <Footer />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}