import { ArrowUp, Eye, ArrowLeft, Undo2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect, ChangeEvent } from "react";
import { Raffle } from "@/types/raflles";
import { cn, formatAddress, formatDecimal } from "@/lib/utils";
import { useChain } from "@cosmos-kit/react";
import axios, { AxiosError } from "axios";
import { promiseToast } from "../ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { MagicCard } from "../ui/magic-card";
import ReactCardFlip from 'react-card-flip';
import { useUser } from "@/hooks/useUser";
import getConfig from "@/config/config";

export interface RaffleCardCustomProps {
    data: Raffle;
}

const config = getConfig();
const RaffleCardCustom = ({ data }: RaffleCardCustomProps) => {

    const summed = data.participants?.reduce((acc, participant) => {
        const address = participant.participant_address || 'Unknown';
        const amount = participant.participant_amount || 0;

        if (!acc[address]) {
            acc[address] = { participant_address: address, total_amount: 0 };
        }
        acc[address].total_amount += amount;

        return acc;
    }, {} as Record<string, { participant_address: string; total_amount: number }>);

    const [raffle, setRaffle] = useState<Raffle>(data);
    const [summedParticipants, setSummedParticipants] = useState<Record<string, { participant_address: string; total_amount: number }>>(summed);
    const [amount, setAmount] = useState<number>(1);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [status, setStatus] = useState<'not_started' | 'active' | 'expired'>('active');
    const [totalTickets, setTotalTickets] = useState(0);
    const [userTickets, setUserTickets] = useState(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { address } = useChain("stargaze");
    const { toast } = useToast();
    const { setUser, setStaker } = useUser();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        const totalTickets = raffle.participants?.reduce((sum, p) => sum + (p.participant_amount || 0), 0) || 0;
        setTotalTickets(totalTickets);

        if (address) {
            const userTickets = raffle.participants?.reduce((sum, p) =>
                p.participant_address == address ? sum + (p.participant_amount || 0) : sum, 0) || 0;
            setUserTickets(userTickets);
        }

        return () => clearInterval(timer);
    }, [data]);

    useEffect(() => {
        updateRaffle();
    }, [address]);

    const calculateTimeLeft = () => {
        if (!raffle.raffle_start || !raffle.raffle_end) return "";

        const now = new Date().getTime();
        const startTime = new Date(raffle.raffle_start).getTime();
        const endTime = new Date(raffle.raffle_end).getTime();

        const formatTime = (difference: number) => {
            // Calculate time units up to days
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Build time string
            const timeArray = [];
            if (days > 0) timeArray.push(`${days}d`);
            if (hours > 0) timeArray.push(`${hours}h`);
            if (minutes > 0) timeArray.push(`${minutes}min`);
            if (seconds > 0) timeArray.push(`${seconds}s`);

            return timeArray.join(' ');
        };

        if (now < startTime) {
            setStatus('not_started');
            return formatTime(startTime - now);
        } else if (now > endTime) {
            setStatus('expired');
            return "";
        } else {
            setStatus('active');
            return formatTime(endTime - now);
        }
    };

    const getStatusStyles = () => {
        switch (status) {
            case 'not_started':
                return {
                    fontBold: "font-base",
                    bgColor: "bg-yellow-700/20 justify-center",
                    dotBg: "bg-yellow-500/50",
                    dot: "bg-yellow-500",
                    text: "Start in:"
                };
            case 'expired':
                return {
                    fontBold: "font-bold !text-white",
                    bgColor: "bg-red-700/20 justify-center",
                    dotBg: "bg-red-500/50",
                    dot: "bg-red-500",
                    text: "Ended"
                };
            default:
                return {
                    fontBold: "font-base",
                    bgColor: "bg-lime-700/20 justify-center",
                    dotBg: "bg-lime-500/50",
                    dot: "bg-lime-500",
                    text: "Ends in:"
                };
        }
    };

    const statusStyles = getStatusStyles();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setAmount(1);
            return;
        }
        if (raffle.raffle_max_ticket && value > raffle.raffle_max_ticket) {
            setAmount(raffle.raffle_max_ticket);
            return;
        }
        setAmount(value);
    };

    const handleBuy = () => {
        if (status !== 'active') return;
        if (raffle.raffle_max_ticket && totalTickets + amount > raffle.raffle_max_ticket) return;

        if (!address) {
            toast({
                variant: "destructive",
                title: "Please Login first",
                description: "You must be logged in to buy tickets. Please login to your account to proceed."
            })
            return;
        }

        promiseToast(doBuy(amount, raffle.raffle_id), {
            loading: {
                title: "Processing...",
                description: "Please Wait"
            },
            success: () => {
                setLoading(false);
                return {
                    title: "Success!",
                    description: "Buy Ticket Success"
                };
            },
            error: (error: AxiosError | any) => ({
                title: "Ups! Something wrong.",
                description: error?.response?.data?.message || 'Internal server error.'
            })
        });
    };

    const doBuy = async (amount: number, raffle_id: number) => {
        await axios.post("/api/raffle/buy", {
            raffle_id,
            wallet_address: address,
            amount
        });
        updateRaffle();
    }

    const handleDrawWinner = () => {
        setLoading(true);
        promiseToast(doWinner(), {
            loading: {
                title: "Processing...",
                description: "Please Wait"
            },
            success: () => {
                setLoading(false);
                return {
                    title: "Success!",
                    description: "Draw Winner Success"
                };
            },
            error: (error: AxiosError | any) => ({
                title: "Ups! Something wrong.",
                description: error?.response?.data?.message || 'Internal server error.'
            })
        });
    }

    const doWinner = async () => {
        await axios.post("/api/raffle/draw", {
            raffle_id: raffle.raffle_id
        });
        updateRaffle();
    }

    const renderButton = () => {
        switch (status) {
            case 'active':
            case 'not_started':
                return <div>
                    <div className={cn("grid gap-y-2 py-2", status == "not_started" && "mt-5")}>
                        <div className="flex items-center text-sm gap-x-2">
                            <span className="text-gray-400">Price: </span>
                            <span className="font-bold">
                                {formatDecimal(raffle.raffle_price, 2)} ${raffle.raffle_price_type} | {formatDecimal(totalTickets, 2)} Ticket Sold
                            </span>
                        </div>
                        {status == 'active' && address && <div className="flex items-center text-sm gap-x-2">
                            <span className="text-gray-400">Bought: </span>
                            <span className="font-bold text-green-500">
                                {formatDecimal(userTickets * (raffle.raffle_price || 0), 2)} ${raffle.raffle_price_type} | {formatDecimal(userTickets, 2)} Ticket
                            </span>
                        </div>}
                    </div>
                    <div className="flex items-center gap-x-2 py-2">
                        <div className="relative group">
                            <input
                                className="bg-stone-800 text-white font-black text-lg text-center border-none focus:border-none hover:border-none focus-visible:ring-0 rounded-[10px] w-[80px] h-[45px] no-spinner"
                                value={amount}
                                onChange={handleAmountChange}
                                type="number"
                                min={1}
                                max={raffle.raffle_max_ticket ?? undefined}
                                disabled={status !== 'active'}
                                style={{
                                    WebkitAppearance: "none", // Chrome, Safari, Edge
                                    MozAppearance: "textfield", // Firefox
                                }}
                            />
                            <div className="absolute right-2 top-0 h-full flex flex-col justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                                <button
                                    className="text-white hover:text-gray-300 focus:outline-none -mb-1 opacity-50"
                                    onClick={() =>
                                        handleAmountChange({
                                            target: { value: Math.min((amount || 0) + 1, raffle.raffle_max_ticket || Infinity).toString() },
                                        } as ChangeEvent<HTMLInputElement>)
                                    } disabled={status !== 'active'}
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </button>
                                <button
                                    className="text-white hover:text-gray-300 focus:outline-none -mt-1 opacity-50"
                                    onClick={() => handleAmountChange({ target: { value: Math.max((amount || 0) - 1, 1).toString() } } as ChangeEvent<HTMLInputElement>)}
                                    disabled={status !== 'active'}
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full font-black text-lg text-black rounded-[10px] h-[45px]",
                                status === 'active' ? "bg-green-500 hover:bg-green-400 hover:text-black" :
                                    status === 'not_started' ? "bg-yellow-500 hover:bg-yellow-400" :
                                        "bg-gray-500 hover:bg-gray-400"
                            )}
                            onClick={handleBuy}
                            disabled={status !== 'active' || loading}
                        >
                            {status === 'not_started' ? 'Not Started' : 'Buy'}
                        </Button>
                    </div>
                </div>
            case 'expired':
                return raffle?.rewards[0]?.reward_win_address ? (
                    <div className="grid gap-y-2 mt-6">
                        <h1 className="text-lg font-bold text-center">🥳 Raffle Winner 🥳</h1>
                        <Link href={`https://www.stargaze.zone/p/${raffle?.rewards[0]?.reward_win_address}/tokens`} target="_blank" >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full font-black text-lg text-black rounded-[10px] h-[45px]",
                                    "bg-green-500 hover:bg-green-400 hover:text-black"
                                )}>
                                <span className='font-bold'>{formatAddress(raffle?.rewards[0]?.reward_win_address ?? undefined)}</span>
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full font-black text-lg text-black rounded-[10px] h-[45px] mt-12",
                            "bg-green-500 hover:bg-green-400 hover:text-black"
                        )}
                        disabled={loading}
                        onClick={handleDrawWinner}>
                        Draw Winner
                    </Button>
                )
        }
    }

    const updateRaffle = async () => {
        const resp = await axios.get("/api/raffle/" + data.raffle_id);
        const dataUpdated = resp.data.data as Raffle;
        setRaffle(dataUpdated);

        const summed = dataUpdated.participants?.reduce((acc, participant) => {
            const address = participant.participant_address || 'Unknown';
            const amount = participant.participant_amount || 0;

            if (!acc[address]) {
                acc[address] = { participant_address: address, total_amount: 0 };
            }
            acc[address].total_amount += amount;

            return acc;
        }, {} as Record<string, { participant_address: string; total_amount: number }>);
        setSummedParticipants(summed);

        const totalTickets = dataUpdated.participants?.reduce((sum, p) => sum + (p.participant_amount || 0), 0) || 0;
        setTotalTickets(totalTickets);

        if (address) {
            const userTickets = dataUpdated.participants?.reduce((sum, p) =>
                p.participant_address == address ? sum + (p.participant_amount || 0) : sum, 0) || 0;
            setUserTickets(userTickets);
        }

        let respUser = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
        setUser(respUser.data?.data?.user);
        setStaker(respUser.data?.data?.staker);

    }

    const renderParticipants = () => {
        return (
            <div className="flex flex-col h-full">
                <div className={cn("flex items-center gap-2 p-2 px-6 text-sm", statusStyles.bgColor)}>
                    <div className={cn("w-4 h-4 flex items-center justify-center rounded-full blinker", statusStyles.dotBg)}>
                        <div className={cn("w-2 h-2 rounded-full", statusStyles.dot)} />
                    </div>
                    <span className={cn("text-gray-400", statusStyles.fontBold)}>{statusStyles.text}</span>
                    <span className="font-bold">{timeLeft}</span>
                </div>
                <div className="flex-1 border-t-2 border-[#323237] p-2 px-6">
                    {data?.rewards?.[0] && (
                        <Link target="_blank" href={`https://www.stargaze.zone/m/${raffle.rewards[0].reward_collection}/${raffle.rewards[0].reward_token_id}`}>
                            <div className="flex items-center justify-between">
                                <h1 className="font-semibold text-lg truncate">{raffle.rewards[0].reward_name}</h1>
                                <ArrowUp className="rotate-45" />
                            </div>
                        </Link>
                    )}
                    <div className="py-2">
                        <span className="opacity-50 my-2">Raffle Participants</span>
                        <ScrollArea className="h-[360px] md:!h-[345px]"> {/* Fixed height to match front card image */}
                            <div className="px-2">
                                {Object.values(summedParticipants)?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center my-2">
                                        <div className="flex items-center gap-3">
                                            <span className="opacity-50">{index + 1}.</span>
                                            <Link href={`https://www.stargaze.zone/p/${item.participant_address}/tokens`} target="_blank">
                                                <span className="text-[#DB2877]">
                                                    {formatAddress(item.participant_address ?? undefined)}
                                                </span>
                                            </Link>
                                        </div>
                                        <span className="">
                                            {formatDecimal(item.total_amount, 2)} Ticket
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className={cn(
                        "flex justify-center my-2",
                        "transition-all duration-300",
                        isFlipped
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                    )}>
                        <Button
                            onClick={() => setIsFlipped(false)}
                            variant="ghost"
                            className="hover:bg-transparent italic gap-x-2 opacity-50 hover:opacity-60 items-center"
                        >
                            <Undo2 size={18} />
                            <span className="mt-1 text-[13px]">Back</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ReactCardFlip isFlipped={isFlipped}>
            <MagicCard
                className="w-full"
                gradientColor={"#262626"}
            >
                <div className="h-[535px] md:!h-[520px] rounded-[12px] overflow-hidden">
                    <div className={cn("flex items-center gap-2 p-2 px-6 text-sm", statusStyles.bgColor)}>
                        <div className={cn("w-4 h-4 flex items-center justify-center rounded-full blinker", statusStyles.dotBg)}>
                            <div className={cn("w-2 h-2 rounded-full", statusStyles.dot)} />
                        </div>
                        <span className={cn("text-gray-400", statusStyles.fontBold)}>{statusStyles.text}</span>
                        <span className="font-bold">{timeLeft}</span>
                    </div>
                    <div className="h-[445px] md:!h-[430px] border-t-2 border-[#323237] p-2 px-6">
                        {data?.rewards?.[0] && (
                            <Link target="_blank" href={`https://www.stargaze.zone/m/${raffle.rewards[0].reward_collection}/${raffle.rewards[0].reward_token_id}`}>
                                <div className="flex items-center justify-between">
                                    <h1 className="font-semibold text-lg truncate">{raffle.rewards[0].reward_name}</h1>
                                    <ArrowUp className="rotate-45" />
                                </div>
                            </Link>
                        )}
                        <div>
                            <div className="py-2">
                                <div className="w-full bg-center aspect-square rounded-xl overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover transition-transform duration-300 hover:scale-105"
                                        style={{
                                            backgroundImage: `url(${raffle.rewards?.[0]?.reward_token_img})`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            {renderButton()}
                        </div>
                    </div>
                    <div className={cn(
                        "flex justify-center my-2",
                        "transition-all duration-300",
                        isFlipped
                            ? "opacity-0 translate-y-4 pointer-events-none"
                            : "opacity-100 translate-y-0"
                    )}>
                        <Button
                            onClick={() => setIsFlipped(true)}
                            variant="ghost"
                            className="hover:bg-transparent italic gap-x-2 opacity-50 hover:opacity-60 text-[13px]"
                        >
                            <Eye size={18} />
                            <span>See Participants</span>
                        </Button>
                    </div>
                </div>
            </MagicCard>
            <MagicCard
                className="w-full"
                gradientColor={"#262626"}
            >
                <div className="h-[535px] md:!h-[520px] rounded-[12px] overflow-hidden">
                    {renderParticipants()}
                </div>
            </MagicCard>
        </ReactCardFlip>
    );
}

export default RaffleCardCustom;