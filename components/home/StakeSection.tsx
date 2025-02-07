import React from "react";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import StakeCard from "@/components/StakeCard";
import StakeCardMobile from "../StakeCardMobile";
import { BoxStatStake } from "../BoxStatStake";
import { mst_collection } from "@prisma/client";

export interface StakeSectionProps {
  projectid: string,
  collection: mst_collection
}

const StakeSection = ({
  projectid,
  collection
}: StakeSectionProps) => {
  return (
    <div className="relative">
      <div className="absolute md:top-0 left-6 right-6 md:left-20 md:right-20">
        <div className="hidden md:!flex w-full">
          <StakeCard collection={collection} />
        </div>
        <div className="flex md:!hidden w-full">
          <StakeCardMobile collection={collection} />
        </div>
      </div>
      <div className="h-[245px] md:!h-[265px]" />
      {/* <BoxLeaderboard /> */}
      <BoxStatStake collection={projectid} />
    </div>
  );
};

export default StakeSection;
