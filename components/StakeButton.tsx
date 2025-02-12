"use client";
import getConfig from "@/config/config";
import { useChain, useWallet } from "@cosmos-kit/react";
import axios, { AxiosResponse } from "axios";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useClaim } from "@/hooks/useClaim";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export interface StakeSliderProps {
  projectCode?: string,
  className?: string
}

const StakeSlider = ({
  projectCode,
  className
}: StakeSliderProps ) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const maxValue = 100;
  const { address } = useChain("stargaze");
  const { toast, promiseToast } = useToast();
  const { setClaim } = useClaim();

  useEffect(() => {
    const calculateSliderWidth = () => {
      if (sliderRef.current) {
        const totalWidth = sliderRef.current.offsetWidth;
        const chevronWidth = chevronRef.current ? chevronRef.current.offsetWidth : 56;
        const availableWidth = totalWidth - (chevronWidth * 1.5);
        setSliderWidth(availableWidth + 15);
      }
    };

    calculateSliderWidth();
    window.addEventListener('resize', calculateSliderWidth);

    return () => {
      window.removeEventListener('resize', calculateSliderWidth);
    };
  }, []);

  useEffect(() => {
    if (sliderPosition === maxValue) {
      handleAction();
    }
  }, [sliderPosition]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    updateSliderPosition(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Common function to update slider position
  const updateSliderPosition = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const clampedValue = Math.min(Math.max(offsetX, 0), sliderWidth);
    setSliderPosition((clampedValue / sliderWidth) * maxValue);
  };

  // Common function to handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    if (sliderPosition !== maxValue) {
      setSliderPosition(0);
    }
  };

  const handleAction = async () => {
    try {
      setClaim(false);
      promiseToast(axios.post("/api/soft-staking/create", {
        staker_address: address,
        project_code: projectCode
      }), {
        loading: {
          title: "Processing...",
          description: "Please Wait"
        },
        success: (result) => {
          setClaim(true);
          showConfeti();
          return {
            title: "Success!",
            description: "Stake Successfully"
          }
        },
        error: (error: AxiosResponse | any) => {
          setSliderPosition(0);
          return {
            title: "Ups! Something wrong.",
            description: error?.response?.data?.message || 'Internal server error.'
          }
        }
      });
    } catch (error: AxiosResponse | any) {
      setSliderPosition(0);
      toast({
        variant: 'destructive',
        title: 'Ups! Something wrong.',
        description: error?.response?.data?.message || 'Internal server error.'
      });
    }
  };

  const showConfeti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 1,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 1,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }

  return (
    <div>
      <div
        ref={sliderRef}
        className={cn(`
          relative w-full h-16 bg-black rounded-2xl flex items-center overflow-hidden
          ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
          touch-none
        `, className)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          if (sliderPosition < maxValue) setSliderPosition(0);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black via-gray-900 to-black opacity-80 rounded-2xl"
          style={{
            backgroundSize: `${(sliderPosition / maxValue) * 100}% 100%`,
            transition: 'background-size 0.3s ease-out'
          }}
        />

        <div
          ref={chevronRef}
          className={`
            absolute left-1 top-1/2 transform -translate-y-1/2 
            flex items-center justify-center w-14 h-14 
            overflow-hidden rounded-2xl z-10
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{
            transform: `translate(${(sliderPosition / maxValue) * sliderWidth}px, -50%)`,
            transition: !isDragging && sliderPosition < maxValue
              ? "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)"
              : "none",
            boxShadow: isDragging
              ? "0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)"
              : "0 2px 4px rgba(0,0,0,0.2)"
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <img
            src="/images/Icon/Swipe.png"
            alt="Swipe"
            className={`
              h-16 max-w-max rounded-2xl 
              transition-transform duration-200
              ${isDragging ? 'scale-95' : 'scale-100'}
              select-none
            `}
            draggable="false"
          />
        </div>

        <span
          className={`
            absolute inset-0 flex items-center ml-24 
            text-white text-lg font-medium select-none
            transition-all duration-300
            ${sliderPosition === maxValue ? 'text-green-400 opacity-100' : 'opacity-80'}
          `}
        >
          {sliderPosition === maxValue ? "Staked!" : "Stake Now"}
        </span>
      </div>
    </div>
  );
};

export default StakeSlider;