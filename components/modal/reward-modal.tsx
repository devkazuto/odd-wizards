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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent isClose={false} className="max-w-[95%] md:!max-w-[350px] rounded-xl bg-black px-2 py-2">
                <div className="w-full bg-black text-white">
                    <div className='grid justify-center items-center'>
                        <div>
                            <span className='font-bold text-xl'>Congratulations 🎉</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="text-sm text-gray-400">You get a prize</span>
                            <Link href={`https://www.stargaze.zone/m/${token?.collection.contractAddress}/${token?.tokenId}`} target="_blank">
                                <span className='text-sm font-bold'>{token?.name}</span>
                            </Link>
                        </div>
                    </div>
                    <div className='px-2 pb-2'>
                        <div className="bg-center aspect-square rounded-xl overflow-hidden my-2">
                            <div
                                className="w-full h-full bg-cover transition-transform duration-300 hover:scale-105"
                                style={{
                                    backgroundImage: `url('${token?.media.url}')`,
                                }}
                            ></div>
                        </div>
                        {
                            isClaimed && <div className='flex items-center justify-center truncate gap-2'>
                                <span className='text-xs md:!text-sm text-gray-400'>Your reward has claimed tx hash:</span>
                                <Link className='text-xs md:!text-sm text-gray-400' href={`https://www.mintscan.io/stargaze/tx/${txHash}`} target="_blank">{formatAddress(`${txHash}`)}</Link>
                            </div>
                        }
                        {
                            isClaimed ? (
                                <div className='my-2'>
                                    <Button onClick={() => setOpen(false)} className='w-full bg-green-500 hover:bg-green-400 rounded-[10px]' variant={"default"} >Close</Button>
                                </div>
                            ) : (
                                <Button onClick={claimReward} disabled={loading} className='w-full bg-green-500 hover:bg-green-400 rounded-[10px]' variant={"default"} >Claim Reward</Button>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
