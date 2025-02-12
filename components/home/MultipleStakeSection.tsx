import React from "react";
import { BoxStatStake } from "../BoxStatStake";
import MultipleStakeCard from "../MultipleStakeCard";
import CollectionCard from "../stake/CollectionCard";
import { mst_collection, mst_project, mst_reward } from "@prisma/client";
import Leaderboard from "../Leaderboard";
import Carousel from "../Carausel";

export interface MultipleStakeSectionProps {
    project: mst_project,
    projectid: string,
    collections: mst_collection[] | [],
    rewards: mst_reward[] | []
}

const MultipleStakeSection = ({
    project,
    projectid,
    collections,
    rewards
}: MultipleStakeSectionProps) => {

    const imageList = rewards?.map((item) => {
        return {
            name: item.reward_name ?? "",
            src: item.reward_image_url ?? "",
            alt: item.reward_name ?? "",
        }
    });

    return (
        <div className="relative">
            <BoxStatStake project={project} collection={projectid} />
            <div>
                <div className="hidden md:!flex w-full">
                    <MultipleStakeCard projectCode={project?.project_code ?? "-"} />
                </div>
                <div className="grid grid-cols-2 px-20 gap-4 mt-10">
                    {
                        collections.map((collection, index) => {
                            return <CollectionCard collection={collection} key={index} />
                        })
                    }
                </div>
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
        </div>
    );
};

export default MultipleStakeSection;
