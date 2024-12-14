"use client";

import { FC, useEffect, useState } from "react";
import StakeButton from "@/components/StakeButton";
import { WalletStatus } from '@cosmos-kit/core';
import { useChain, useWallet } from "@cosmos-kit/react";
import ConnectButton from "@/components/ConnectButton";
import axios, { AxiosError } from "axios";
import getConfig from "@/config/config";
import { mst_staker } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { promiseToast, useToast } from "./ui/use-toast";
const StakeCard: FC = () => {

  const [staker, setStaker] = useState<mst_staker | undefined>(undefined);
  const [isFetch, setIsFetch] = useState<boolean>(false);
  // const [point, setPoints] = useState<number>(0);
  const config = getConfig();
  const wallet = useWallet();
  const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
  const { toast } = useToast();


  useEffect(() => {
    setIsFetch(false);
    async function fetchData() {
      try {
        let resp = await axios.get(`/api/soft-staking/point?wallet_address=${address}&collection_address=${config?.collection_address}`)
        let data = resp.data.data;
        // setPoints(data.points);
        setStaker(data.staker);
      } catch (error: AxiosError | any){
      }
      setIsFetch(true);
    }

    if(wallet.status == WalletStatus.Connected && address){
      fetchData();
    }


  }, [address]);

  const doStakeAndClaim = async () => {
    try {

      promiseToast(axios.post("/api/soft-staking/claim", {
        staker_address: address,
        collection_address: config?.collection_address
      }), {
        loading: {
          title: "Processing...",
          description: "Please Wait"
        },
        success: (result) => ({
          title: "Success!",
          // description: `Operation completed: ${result}`
          description: `Stake and Claim Successfuly`
        }),
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

  return (
    <div className="bg-[#18181B] border-2 border-[#323237] p-8 rounded-[85px] flex gap-x-4">
      <img src="/images/stake-wizard.gif" className="w-[175px] rounded-[50px]" />
      <div className="w-full p-4">
        <div className="flex justify-between mb-2">
          <h1 className="text-white text-4xl font-semibold">Odd Wizard</h1>
          <div className="flex items-center gap-x-4">
            <span className="text-white text-lg font-semibold">Trade collection 👉</span>
            <img src="/images/Icon/stargaze.png" width="30px" />
          </div>
        </div>
        <p className="text-lg text-gray-400 leading-tight">Each NFT represents a unique wizard, crafted to</p>
        <p className="text-lg text-gray-400 leading-tight">guide and assist you in exploring the cosmos.</p>
        {

        }
        {
          wallet.status != WalletStatus.Connected ? (
            <div className="mt-2">
              <ConnectButton />
            </div>
          ) : (
            isFetch && <div className="mt-2">
              {
                staker ? 
                (<Button 
                  variant={"ghost"}
                  onClick={doStakeAndClaim}
                  className="px-8 py-3 h-max font-black text-black rounded-xl bg-green-500 hover:bg-green-600 hover:text-black"
                  >Stake And Claim</Button>) : 
                (<StakeButton />)
              }
            </div>
            
          )
        }
      </div>
    </div>
  );
};

export default StakeCard;
