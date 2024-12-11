"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Carousel Component
interface ImageData {
  src: string;
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
      return "z-30 transform scale-110 translate-x-0 opacity-100";
    } else if (relativeIndex === 1) {
      return "z-20 transform scale-100 translate-x-[200px] opacity-80";
    } else if (relativeIndex === 2) {
      return "z-10 transform scale-90 translate-x-[400px] opacity-60";
    } else if (relativeIndex === images.length - 1) {
      return "z-20 transform scale-100 -translate-x-[200px] opacity-80";
    } else if (relativeIndex === images.length - 2) {
      return "z-10 transform scale-90 -translate-x-[400px] opacity-60";
    } else {
      return "hidden";
    }
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`absolute transition-all duration-700 ease-in-out ${getPositionStyle(
              index
            )}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
