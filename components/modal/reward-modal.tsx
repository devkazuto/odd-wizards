'use client';

import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import getConfig from '@/config/config';
import { Token } from '@/types';
import axios, { AxiosResponse } from 'axios';
import confetti from "canvas-confetti";
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useToast } from '../ui/use-toast';
import { formatAddress } from '@/lib/utils';
import ScratchToReveal from '../ui/scratch-to-reveal';

const config = getConfig();

interface RewardModalProps {
    wallet: string | undefined;
    isOpen: boolean;
    onClose: () => void;
    setOpen: (open: boolean) => void
}

export default function RewardModalModal({
    wallet,
    isOpen,
    onClose,
    setOpen
}: RewardModalProps) {

    const [token, setToken] = useState<Token>();
    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [txHash, setTxHash] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const { toast, promiseToast } = useToast();

    useEffect(() => {
        fetchData();
    }, [wallet]);

    async function fetchData() {
        setLoading(true);
        let resp = await axios.get(`/api/soft-staking/reward?wallet_address=${wallet}&collection_address=${config?.collection_address}`);
        setToken(resp.data.data.token);
        setIsClaimed(resp.data.data.isClaimed);
        setTxHash(resp.data.data.txHash);
        setLoading(false);
        if (!resp.data.data.isClaimed) {
            triggerConffeti();
        }
    }

    const triggerConffeti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 500, ticks: 100, zIndex: 9999 };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 75 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 1000);
    };

    const claimReward = () => {
        try {
            setLoading(true);
            promiseToast(doClaimReward(), {
                loading: {
                    title: "Processing...",
                    description: "Please Wait"
                },
                success: (result) => {
                    triggerConffeti();
                    fetchData();
                    setLoading(false);
                    return {
                        title: "Success!",
                        description: "Claim Reward Successfully"
                    }
                },
                error: (error: AxiosResponse | any) => {
                    setLoading(false);
                    return {
                        title: "Ups! Something wrong.",
                        description: error?.response?.data?.message || 'Internal server error.'
                    }
                }
            });
        } catch (error: AxiosResponse | any) {
            toast({
                variant: 'destructive',
                title: 'Ups! Something wrong.',
                description: error?.response?.data?.message || 'Internal server error.'
            });
        }
    }

    const doClaimReward = async () => {
        await axios.post("/api/soft-staking/claim-reward", {
            staker_address: wallet,
            collection_address: config?.collection_address
        });
    }

    const doShare = async () => {
        const tweetText = `Just won this from https://www.oddsgarden.io/\nhttps://www.stargaze.zone/m/${token?.collection.contractAddress}/${token?.tokenId}\n\nThank you!🥳\n\n#oddsgarden #stargaze`;
        const encodedTweetText = encodeURIComponent(tweetText);
        const mobileTweetUrl = `twitter://post?message=${encodedTweetText}`; // Mobile app scheme
        const webTweetUrl = `https://x.com/intent/tweet?text=${encodedTweetText}`;

        // Detect if the user is on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = mobileTweetUrl;
        } else {
            // Create temporary link element for web
            const link = document.createElement('a');
            link.href = webTweetUrl;
            link.target = '_blank';
            // link.rel = 'noopener noreferrer'; // Security best practice for target="_blank"
            document.body.appendChild(link);

            // Trigger click and remove element
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent isClose={false} className="max-w-[95%] md:!max-w-[350px] rounded-xl bg-black px-2 py-2 !bg-transparent !border-0 !border-transparent">
                <div className="w-full text-white">
                    <div className='rounded-[35px] px-6 py-2 bg-[#171717] border-1 border-[#323237]' >
                        <div className='grid justify-center items-center'>
                            <div>
                                {
                                    isClaimed ? (
                                        <span className='font-bold text-lg md:!text-xl'>🥳 Claimed 🥳</span>
                                    ) : (
                                        <span className='font-bold text-lg md:!text-xl'>👑 Congratulations 👑</span>
                                    )
                                }
                            </div>
                            {
                                isClaimed ? (
                                    <div className='flex items-center justify-center truncate gap-2'>
                                        <span className='text-xs md:!text-sm text-gray-400'>Tx Hash:</span>
                                        <Link className='text-xs md:!text-sm text-gray-400' href={`https://www.mintscan.io/stargaze/tx/${txHash}`} target="_blank">{formatAddress(`${txHash}`)}</Link>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2 truncate'>
                                        <span className="text-sm text-gray-400">You get a prize</span>
                                        <Link href={`https://www.stargaze.zone/m/${token?.collection.contractAddress}/${token?.tokenId}`} target="_blank">
                                            <span className='text-sm font-bold'>{token?.name}</span>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                        <div>
                            <div className="bg-center aspect-square rounded-xl overflow-hidden my-2">
                                {
                                    isClaimed ? (
                                        <div
                                            className="w-full h-full bg-cover transition-transform duration-300 hover:scale-105"
                                            style={{
                                                backgroundImage: `url('${token?.media.url}')`,
                                            }}
                                        ></div>
                                    ) : (
                                        <ScratchToReveal
                                            minScratchPercentage={70}
                                            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
                                            onComplete={() => { }}
                                            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
                                        >
                                            {/* <p className="text-9xl">😎</p> */}
                                            <div
                                                className="w-full h-full bg-cover transition-transform duration-300 hover:scale-105"
                                                style={{
                                                    backgroundImage: `url('${token?.media.url}')`,
                                                }}
                                            ></div>
                                        </ScratchToReveal>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        {
                            isClaimed ? (
                                <div className='my-2 flex items-center gap-2'>
                                    <Button onClick={() => setOpen(false)} className='w-full bg-red-500 hover:bg-red-400 rounded-[100px] text-black' variant={"default"} >Close</Button>
                                    <Button onClick={doShare} className='w-full bg-blue-500 hover:bg-blue-400 rounded-[100px] text-black' variant={"default"} >Share</Button>
                                </div>
                            ) : (
                                <Button onClick={claimReward} disabled={loading} className='w-full bg-green-500 hover:bg-green-400 rounded-[100px] text-black' variant={"default"} >Claim Reward</Button>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}
