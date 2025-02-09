"use client";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { mst_project } from "@prisma/client";
import axios from "axios";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import Loading from "@/components/Loading";

interface projectType extends mst_project {
    rewards?: any[];
}

export default function About() {

    const [loading, setLoading] = useState<boolean>(true);
    const [challenges, setChallenges] = useState<projectType[] | []>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const resp = await axios.get("/api/project/challenge");
            setChallenges(resp.data.data);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-[url('/images/Cosmos.gif')] bg-cover bg-center">
            <div className="bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-0" />
            <Header />
            <div className="relative pt-28">
                <h1 className="text-5xl text-center font-black">Challenges</h1>
                {loading ? (
                    <div className="flex justify-center mt-10">
                        <Loading />
                    </div>
                ) : (
                    <div className="my-10 grid grid-cols-2 md:grid-cols-3 gap-8 px-32">
                        {
                            challenges.map((project, index) => {
                                return <ChallengeCard key={index} project={project} />
                            })
                        }
                    </div>
                )}
            </div>
            <Footer className="my-0 md:!my-0 py-8" />
        </div>
    );
}
