"use client";
import { mst_project } from "@prisma/client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export interface ChallengeCardProps{
    project: mst_project & {
        rewards?: any[];
    }
}

const ChallengeCard = ({
    project
}: ChallengeCardProps) => {

    const [data, setData] = useState<any>(project);
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [data])

    const calculateTimeLeft = () => {

        const now = new Date().getTime();
        const endTime =  project.project_leaderboard_enddate ? new Date(project.project_leaderboard_enddate).getTime() : new Date().getTime();

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

        if (now > endTime) {
            return "";
        } else {
            return "End in " +  formatTime(endTime - now);
        }
    };

    return (
        <div className="w-full grid gap-2 rounded-[20px] p-4 bg-neutral-900 border-2 border-[#323237]">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center rounded-full blinker bg-green-500/50">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span>{timeLeft}</span>
            </div>
            <span className="font-bold">{project.project_name}</span>
            <div className="rounded-[8px] bg-center bg-cover aspect-square w-full h-full">
                <img src={project.project_profile_image ?? ""}
                    className="rounded-[8px] bg-center bg-cover aspect-square w-full h-full"
                />
            </div>
            <p className="text-sm text-gray-400">🏆 Number of Winners: <span className="text-white">{project?.rewards ?  project?.rewards.length : 0}</span></p>
            <Button className="rounded-[8px] bg-[#323237] w-full hover:bg-[#323237]" >Read more</Button>
        </div>
    )
}

export default ChallengeCard;