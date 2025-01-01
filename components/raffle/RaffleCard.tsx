import { ArrowUp, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import NumberTicker from "../ui/number-ticker";
import { Separator } from "../ui/separator";

const RaffleCard = () => {

    const [amount, setAmount] = useState<number>(1);

    return (<div className="w-full bg-[#18181B] border-2 border-[#323237] rounded-[20px] overflow-hidden">
        <div className="flex items-center gap-2 p-2 bg-lime-700/20 px-2 text-sm">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-green-500/50 blinker">
                <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-400">Ends in:</span>
            <span className="font-bold">24h 23min 12s</span>
        </div>
        <div className="p-2 border-t-2 border-[#323237]">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">Happy Clock</h1>
                <Link href="#">
                    <ArrowUp className="rotate-45" />
                </Link>
            </div>
            <div className="py-2">
                <div className="w-full bg-[url('https://i.stargaze-apis.com/dIbflJ7mIjUVCe3t0p-XzDsaaROmvetFM_20Q6DNUmc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeibhs2db2hthmlnwfvbuduvorybvazltxdmir5w4zoidhzfrbmyvom/885.png')] bg-cover bg-center aspect-square rounded-xl">
                </div>
            </div>
            <div className="grid gap-y-2 py-2">
                <div className="flex items-center text-xs gap-x-2">
                    <span className="text-gray-400">Price: </span>
                    <span className="font-bold">
                        {/* <NumberTicker value={100 ?? 0} decimalPlaces={2} /> $SMKR | <NumberTicker value={25000 ?? 0} decimalPlaces={2} /> Ticket Sold */}
                        {100 ?? 0} $SMKR | {25000 ?? 0} Ticket Sold
                    </span>
                </div>
                <div className="flex items-center text-xs gap-x-2">
                    <span className="text-gray-400">Bought: </span>
                    <span className="font-bold text-green-500">
                        {/* <NumberTicker className="text-green-500" value={100 ?? 0} decimalPlaces={2} /> $SMKR | <NumberTicker className="text-green-500" value={25000 ?? 0} decimalPlaces={2} /> Ticket */}
                        {100 ?? 0} $SMKR | {25000 ?? 0} Ticket
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-x-2 py-2">
                <Input className="bg-stone-800 text-white font-black text-lg text-center border-none focus:border-none hover:border-none focus-visible:ring-0 rounded-[10px] w-[100px]"
                    value={amount}
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        const value = Number(target.value);
                        if(isNaN(value)){
                            setAmount(1);
                        }

                        if (value > 0) {
                            setAmount(Number(value));
                        }
                    }}
                />
                <Button variant={"ghost"} className="w-full bg-green-500 hover:bg-green-400 font-black text-lg text-black hover:text-black rounded-[10px]" >Buy</Button>
            </div>
            <div className="flex items-center justify-center text-sm gap-x-1">
                <Button variant={"ghost"} className="hover:bg-transparent" >
                    <Eye size={20} />
                    <span className="italic">See Participant</span>
                </Button>
            </div>
        </div>
    </div>)
}

export default RaffleCard;