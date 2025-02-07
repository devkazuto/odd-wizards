"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Carousel Component
interface ImageData {
  src: string;
  name: string;
  alt: string;
}

interface CarouselProps {
  images: ImageData[];
  interval?: number; // Optional interval for auto-slide (default: 3000ms)
}

const Carousel: React.FC<CarouselProps> = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(autoSlide);
  }, [images.length, interval]);

  const getPositionStyle = (index: number) => {
    const relativeIndex =
      (index - currentIndex + images.length) % images.length;

    if (relativeIndex === 0) {
      return "z-30 transform scale-125 translate-x-0 opacity-100";
    } else if (relativeIndex === 1) {
      return "z-20 transform scale-110 translate-x-[55px] md:translate-x-[200px] opacity-80";
    } else if (relativeIndex === 2) {
      return "z-10 transform scale-90 translate-x-[105px] md:translate-x-[400px] opacity-60";
    } else if (relativeIndex === images.length - 1) {
      return "z-20 transform scale-110 -translate-x-[55px] md:-translate-x-[200px] opacity-80";
    } else if (relativeIndex === images.length - 2) {
      return "z-10 transform scale-90 -translate-x-[105px] md:-translate-x-[400px] opacity-60";
    } else {
      return "hidden";
    }
  };

  const getOrdinal = (number: number) =>  {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100; // Handle numbers like 11, 12, 13
    const suffix = 
        value >= 11 && value <= 13 
        ? "th" 
        : suffixes[Math.min(value % 10, 4)] || "th";
    return `${number}${suffix}`;
}

  return (
    <div className="w-full">
      <div className="relative w-full h-[225px] md:h-[550px] overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {images.filter(item => item.name && item.src).map((image, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`absolute transition-all duration-700 ease-in-out ${getPositionStyle(
                index
              )}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-[150px] h-[150px] md:w-[400px] md:h-[400px] rounded-[15px] shadow-lg cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 md:mb-12">
        {/* <h1 className="text-[24px] md:text-[36px] font-bold mb-4 mx-auto">
        </h1> */}
        {
          images[currentIndex] && <p className="text-[13px] md:!text-lg text-gray-400 leading-relaxed">{images[currentIndex]["name"]} for {getOrdinal(currentIndex + 1)} winner</p>
        }
      </div>
    </div>
  );
};

export default Carousel;
