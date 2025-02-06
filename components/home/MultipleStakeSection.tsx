import React from "react";
import { BoxStatStake } from "../BoxStatStake";
import MultipleStakeCard from "../MultipleStakeCard";
import CollectionCard from "../stake/CollectionCard";

export interface MultipleStakeSectionProps {
    projectid: string
}

const MultipleStakeSection = ({
    projectid
}: MultipleStakeSectionProps) => {
    return (
        <div className="relative">
            <BoxStatStake collection={projectid} />
            <div>
                <div className="hidden md:!flex w-full">
                    <MultipleStakeCard />
                </div>
                <div>
                    <CollectionCard />
                </div>
            </div>
        </div>
    );
};

export default MultipleStakeSection;
