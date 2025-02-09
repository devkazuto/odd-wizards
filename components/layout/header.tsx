"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import ConnectButton from "@/components/ConnectButton";
import { useChain, useWallet } from "@cosmos-kit/react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import getConfig from "@/config/config";
import { usePathname } from "next/navigation";
import { cn, formatAddress } from "@/lib/utils";
import { useNavbarMobile } from "@/hooks/useNavbarMobile";
import { signIn, signOut, useSession } from 'next-auth/react';
import { useToast } from "../ui/use-toast";
import { useLoading } from "@/hooks/useLoading";
import { useTheme } from "next-themes";
import RewardModalModal from "../modal/reward-modal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { mst_project } from "@prisma/client";

export default function Header() {
  const { theme, setTheme } = useTheme();
  setTheme("dark");

  const { address, isWalletConnected, getOfflineSigner } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
  const { setUser, setStaker } = useUser();
  const { wallet } = useWallet();
  const config = getConfig();
  const path = usePathname();
  const { isOpened, setOpen } = useNavbarMobile();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [rewardModal, setRewardModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<mst_project[] | []>([]);
  const { toast } = useToast();

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {

    async function fetchData() {
      showLoading();
      if (address) {
        let resp = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
        setUser(resp.data?.data?.user);
        setStaker(resp.data?.data?.staker);
      }

      const projectResp = await axios.get(`/api/project/list`);
      setProjects(projectResp.data.data ?? []);

      hideLoading();
    }

    fetchData();

  }, [address]);

  useEffect(() => {
    if (isWalletConnected && address) {
      handleAuthentication();
    }
  }, [isWalletConnected, address]);

  const handleAuthentication = async () => {
    if (!isWalletConnected || !address) {
      alert("Please connect your wallet first!");
      toast({
        variant: 'destructive',
        title: 'Ups! Something wrong.',
        description: 'Please connect your wallet first!'
      });

      return;
    }

    setIsAuthenticating(true);

    try {

      // Kirim signature ke server untuk autentikasi
      const result = await signIn("credentials", {
        wallet: address,
        // signature: JSON.stringify(signature),
        // message: signMessage,
        redirect: false,
      });

      console.log("Authentication successful!");
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Check for complete page load
  useEffect(() => {
    if (address) {
      // Wait for the window load event
      const handleLoad = async () => {
        let resp = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
        const user = resp.data?.data?.user;
        if (user.is_winner == "Y" && address) {
          // Add a small delay to ensure all components are rendered
          setTimeout(() => {
            setRewardModal(true);
            // triggerConffeti();
            // axios.post("/api/user/trigger-event", {
            //   wallet_address: address
            // })
          }, 500); // Half second delay to ensure everything is rendered
        }
      };

      // If the page is already loaded
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        // Cleanup
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, [address]);

  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between md:px-14 py-5 bg-transparent z-50">
      <RewardModalModal isOpen={rewardModal} setOpen={setRewardModal} onClose={() => { }} wallet={address} />
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* Logo and Links */}
        <div className="flex items-center space-x-4 md:space-x-10">
          {/* Logo */}
          <div className="relative">
            <Link
              href="/"
              aria-label="Home"
              className="group rounded-[12px] md:rounded-[16px] overflow-hidden w-[50px] md:w-[65px] h-[40px] md:h-[50px] flex items-center justify-center"
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                className="group-hover:hidden object-contain"
              />
              <img
                src="/images/logo.gif"
                alt="Logo"
                className="hidden group-hover:block object-contain"
              />
            </Link>
          </div>
          <Link
              href="/challenge"
              className={cn("text-xl font-bold transition-transform ", (path == "/challenge" ? "text-white" : "text-gray-400 hover:text-white"))}
            // style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              Challenge
            </Link>
          {/* Navigation Links */}
          <div className="hidden md:!flex space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className="bg-transparent hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent">
                  <NavigationMenuTrigger className={cn("bg-transparent pt-1 px-0 hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent text-xl font-bold", (path == "/stake" ? "text-white hover:text-white" : "text-gray-400 hover:text-gray-400 hover:text-white"))}>Stake</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0">
                    <div className="grid gap-2 w-[250px] p-4 !bg-white">
                      {
                        projects.map((project, index) => {
                          return <div key={index}> 
                            {
                              project.project_status == "N" ?
                                <div className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold">
                                  <span className="col-span-2">{project.project_icon}</span>
                                  <div className="text-[#156E7E] opacity-30 col-span-10 flex">{project.project_name} (Soon)</div>
                                </div>
                                :
                                <Link href={`/stake/${project.project_code}`} className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold">
                                  <span className="col-span-2">{project.project_icon}</span>
                                  <span className="text-[#156E7E] col-span-10">{project.project_name}</span>
                                </Link>
                            }
                          </div>
                        })
                      }
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link
              href="/raffle"
              className={cn("text-xl font-bold transition-transform ", (path == "/raffle" ? "text-white" : "text-gray-400 hover:text-white"))}
            // style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              Raffle
            </Link>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="hidden md:!block">
          <ConnectButton />
        </div>
        {/* Mobile Menu Button */}
        <div className="md:!hidden flex items-center gap-x-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
            className="text-black focus:outline-none bg-white p-2 rounded-[5px]"
          >
            <svg
              className="w-6 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpened ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M2 22L22 2M2 2l20 20"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M-6 6h36M-6 12h36M-6 18h36"
                />
              )}
            </svg>
          </button>
          {/* <img src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE} onError={(e: any) => {
            e.target.src = DEFAULT_IMAGE_PROFILE;
          }} className="w-[40px] h-[40px] rounded-full" /> */}
        </div>
      </div>
    </nav>
  );
}