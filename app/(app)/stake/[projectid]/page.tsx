"use client"
import Header from "@/components/layout/header";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/footer";
import StakeSection from "@/components/home/StakeSection";
import axios from "axios";
import { mst_project } from "@prisma/client";
import MultipleStakeSection from "@/components/home/MultipleStakeSection";
import Loading from "@/components/Loading";
export default function Stake({ params }: { params: { projectid: string } }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [isMultiCollection, setIsMultiCollection] = useState<boolean>(false);
    const [project, setProject] = useState<any | undefined>();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let resp = await axios.get(`/api/project/${params.projectid}`);
            const respProject = resp.data.data ?? undefined;
            setProject(respProject);
            setIsMultiCollection(respProject?.collections?.length > 1);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div className="bg-black w-full h-[175px] md:h-[70vh] relative overflow-hidden">
                <div className="absolute top-0 w-full h-[100px] md:h-[250px] bg-gradient-to-b from-black to-transparent z-10" />
                <div className="absolute bottom-0 w-full h-[100px] md:h-[250px] bg-gradient-to-b from-transparent to-black z-10" />
                {/* <div className="absolute top-0 left-0 right-0 bottom-0 "> */}
                {/* <div className="md:hidden bg-[url('/images/stake/banner-odds-mobile.png')] bg-cover w-full h-full"></div> */}
                {/* <video autoPlay loop muted className="hidden md:!flex w-full h-full scale-150 md:!scale-100">
                    <source src="/images/stake/banner-odds.mp4" type="video/mp4" />
                    <img src="/images/stake/banner-odds.png" className="w-full" />
                </video> */}
                <div
                    className={`bg-cover w-full h-full`}
                    style={{
                        backgroundImage: `url('${project?.project_banner ?? "/images/stake/banner-odds-mobile.png"}')`
                    }}
                ></div>
                {/* </div> */}
            </div>
            <div className="relative">
                <div
                    style={{
                        backgroundImage: `url('${project?.project_profile_image}')`
                    }}
                    className="bg-cover bg-center w-[100px] h-[100px] md:w-[175px] md:h-[175px] absolute -top-14 md:!-top-24 left-1/2 transform -translate-x-1/2 rounded-full z-20" />
            </div>
            <div className="flex flex-col items-center justify-center mt-14 md:!mt-28 px-5 md:px-20">
                <CustomGradualSpacing
                    className="font-display text-center text-4xl md:!text-6xl font-black md:leading-[5rem]"
                    text={project?.project_name ?? ""}
                />
                <div className="mt-2 mb-6 md:mt-4 md:mb-10 px-5 md:px-32">
                    <p className="text-sm md:!text-xl text-gray-400 leading-none text-center">{project?.project_description}</p>
                </div>
            </div>
            {/* <div className="w-full h-[150px] bg-black" /> */}
            {loading ? (
                <div className="flex justify-center mt-10">
                    <Loading />
                </div>
            ) : (
                <div className="relative">
                    {
                        isMultiCollection ?
                            <MultipleStakeSection project={project} collections={project?.collections ?? []} rewards={project?.rewards} projectid={params.projectid} /> :
                            project?.collections[0] && <StakeSection collection={project?.collections[0]} projectid={params.projectid} />
                    }
                </div>
            )}
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
