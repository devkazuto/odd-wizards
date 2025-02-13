import React from "react";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import StakeCard from "@/components/StakeCard";
import StakeCardMobile from "../StakeCardMobile";
import { BoxStatStake } from "../BoxStatStake";
import { mst_collection, mst_project, mst_reward } from "@prisma/client";
import Leaderboard from "../Leaderboard";
import Carousel from "../Carausel";

export interface StakeSectionProps {
  project: mst_project,
  projectid: string,
  collection: mst_collection,
  rewards: mst_reward[] | []
}

const StakeSection = ({
  project,
  projectid,
  collection,
  rewards
}: StakeSectionProps) => {

  const imageList = rewards?.sort((a, b) => {
    // Compare reward_rank values
    return (a.reward_rank ?? 0) - (b.reward_rank ?? 0);
  }).map((item) => {
    return {
      name: item.reward_name ?? "",
      src: item.reward_image_url ?? "",
      alt: item.reward_name ?? "",
    }
  });

  return (
    <div className="relative">
      <div className="absolute md:top-0 left-6 right-6 md:left-20 md:right-20">
        <div className="hidden md:!flex w-full">
          <StakeCard collection={collection} projectid={projectid} />
        </div>
        <div className="flex md:!hidden w-full">
          <StakeCardMobile collection={collection} projectid={projectid} />
        </div>
      </div>
      <div className="h-[245px] md:!h-[265px]" />
      {/* <BoxLeaderboard /> */}
      <BoxStatStake project={project} collection={projectid} />
      <div hidden={project?.project_is_leaderboard != "Y"}>
        <div className="bg-[url('/images/blur-brown.png')] bg-cover bg-center mt-4 md:!mt-0">
          <Leaderboard project={project} />
          <div className="w-full relative text-white flex flex-col justify-center items-center text-center">
            <div className="mt-4 md:!mt-8 mx-20">
              <h1 className="text-[20px] md:text-[36px] font-bold">
                Prize
              </h1>
              <p className="text-[13px] md:!text-lg text-gray-400 leading-tight">
                Only the biggest stakers will claim victory and win the prize!
              </p>
            </div>
            <Carousel images={imageList ?? []} interval={15000} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeSection;
