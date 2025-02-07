"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface GradualSpacingProps {
  text: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export default function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
}: GradualSpacingProps) {
  // Create a ref for the container
  const ref = useRef(null);
  
  // Check if the component is in view
  const isInView = useInView(ref, { 
    once: true, // Only trigger animation once
    amount: 0.1 // Trigger when 10% of the component is visible
  });

  return (
    <div 
      ref={ref}
      className="flex justify-start"
    >
      <AnimatePresence>
        {isInView && text?.split("").map((char, i) => (
          <motion.h1
            key={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className={cn("drop-shadow-sm", className)}
          >
            {char === " " ? <span>&nbsp;</span> : char}
          </motion.h1>
        ))}
      </AnimatePresence>
    </div>
  );
}