"use client";
import { mst_project } from "@prisma/client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { ScrollArea } from "../scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ChallengeCardProps {
    project: mst_project & {
        rewards?: any[];
    }
}

const ChallengeCard = ({
    project
}: ChallengeCardProps) => {

    const [data, setData] = useState<any>(project);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [isEnded, setIsEnded] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [data])

    const calculateTimeLeft = () => {

        const now = new Date().getTime();
        const endTime = project.project_leaderboard_enddate ? new Date(project.project_leaderboard_enddate).getTime() : new Date().getTime();

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
            setIsEnded(true);
            return "Ended";
        } else {
            setIsEnded(false);
            return "End in " + formatTime(endTime - now);
        }
    };

    const rules = project?.project_chellange_tierrule?.split('\\n');
    const periodes = project.project_chellange_periode?.split('\\n');
    const notes = project.project_chellange_note?.split('\\n');

    return (
        <ReactCardFlip isFlipped={isFlipped}>
            {/* Front Card */}
            <div className="w-[300px] h-[500px] flex flex-col rounded-[20px] p-4 bg-neutral-900 border-2 border-[#323237]">
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-4 h-4 flex items-center justify-center rounded-full blinker", isEnded ? "bg-red-500/50" : "bg-green-500/50")}>
                            <div className={cn("w-2 h-2 rounded-full", isEnded ? "bg-red-500" : "bg-green-500")} />
                        </div>
                        <span>{timeLeft}</span>
                    </div>
                    <span className="font-bold block mb-2">{project.project_name}</span>
                    <div className="relative flex-1 w-full mb-2">
                        <img
                            src={project.project_profile_image ?? ""}
                            alt="Project"
                            className="absolute inset-0 w-full h-full rounded-[8px] object-cover"
                        />
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                        🏆 Number of Winners: <span className="text-white">{project?.rewards ? project?.rewards.length : 0}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsFlipped(true)}
                        className="rounded-[8px] bg-[#323237] w-full hover:bg-[#323237] mt-auto"
                    >
                        Read more
                    </Button>
                    <Link href={`/stake/${project.project_code}`}>
                        <Button
                            className="rounded-[8px] bg-[#323237] w-full hover:bg-[#323237] mt-auto"
                        >
                            Join Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Back Card */}
            <div className="w-[300px] h-[500px] flex flex-col rounded-[20px] p-4 bg-neutral-900 border-2 border-[#323237]">
                <ScrollArea className="flex-1 mb-4">
                    <div className="grid gap-2">
                        <div className="grid bg-[#323237] rounded-[10px] p-4">
                            <span className="text-white font-semibold">TIER RULES:</span>
                            {rules?.map((item, idx) => (
                                <div key={idx} className="text-white">
                                    {item.startsWith('-') ? (
                                        <div className="pl-4 text-sm">{item}</div>
                                    ) : (
                                        <div className="text-sm">{item}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {periodes && (
                            <div className="grid bg-[#323237] rounded-[10px] p-4">
                                <span className="text-white font-semibold">CHALLENGE PERIOD:</span>
                                {periodes?.map((item, idx) => (
                                    <div key={idx} className="text-white">
                                        {item.startsWith('-') ? (
                                            <div className="pl-4 text-sm">{item}</div>
                                        ) : (
                                            <div className="text-sm">{item}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {notes && (
                            <div className="grid bg-[#323237] rounded-[10px] p-4">
                                <span className="text-white font-semibold">NOTE:</span>
                                {notes?.map((item, idx) => (
                                    <div key={idx} className="text-white">
                                        {item.startsWith('-') ? (
                                            <div className="pl-4 text-sm">{item}</div>
                                        ) : (
                                            <div className="text-sm">{item}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <Button
                    onClick={() => setIsFlipped(false)}
                    className="rounded-[8px] bg-[#323237] w-full hover:bg-[#323237] mt-auto"
                >
                    Back
                </Button>
            </div>
        </ReactCardFlip>
    );
}

export default ChallengeCard;