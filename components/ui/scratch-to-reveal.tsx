import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

interface ScratchToRevealProps {
  children: React.ReactNode;
  minScratchPercentage?: number;
  className?: string;
  onComplete?: () => void;
  gradientColors?: [string, string, string];
}

const ScratchToReveal: React.FC<ScratchToRevealProps> = ({
  minScratchPercentage = 50,
  onComplete,
  children,
  className,
  gradientColors = ["#A97CF8", "#F38CB8", "#FDCC92"],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas && !isComplete) {  // Only resize if not complete
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Redraw gradient after resize
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const gradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          gradient.addColorStop(0, gradientColors[0]);
          gradient.addColorStop(0.5, gradientColors[1]);
          gradient.addColorStop(1, gradientColors[2]);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Initial size
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [gradientColors, isComplete]);

  useEffect(() => {
    const handleDocumentMouseMove = (event: MouseEvent) => {
      if (!isScratching || isComplete) return;  // Don't scratch if complete
      scratch(event.clientX, event.clientY);
    };

    const handleDocumentTouchMove = (event: TouchEvent) => {
      if (!isScratching || isComplete) return;  // Don't scratch if complete
      const touch = event.touches[0];
      scratch(touch.clientX, touch.clientY);
    };

    const handleDocumentMouseUp = () => {
      if (isComplete) return;  // Don't check if already complete
      setIsScratching(false);
      checkCompletion();
    };

    const handleDocumentTouchEnd = () => {
      if (isComplete) return;  // Don't check if already complete
      setIsScratching(false);
      checkCompletion();
    };

    document.addEventListener("mousedown", handleDocumentMouseMove);
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("touchstart", handleDocumentTouchMove);
    document.addEventListener("touchmove", handleDocumentTouchMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("touchend", handleDocumentTouchEnd);
    document.addEventListener("touchcancel", handleDocumentTouchEnd);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseMove);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("touchstart", handleDocumentTouchMove);
      document.removeEventListener("touchmove", handleDocumentTouchMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("touchend", handleDocumentTouchEnd);
      document.removeEventListener("touchcancel", handleDocumentTouchEnd);
    };
  }, [isScratching, isComplete]);

  const handleMouseDown = () => {
    if (!isComplete) setIsScratching(true);  // Only allow scratching if not complete
  };

  const handleTouchStart = () => {
    if (!isComplete) setIsScratching(true);  // Only allow scratching if not complete
  };

  const scratch = (clientX: number, clientY: number) => {
    if (isComplete) return;  // Don't scratch if complete
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left + 16;
      const y = clientY - rect.top + 16;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const startAnimation = async () => {
    await controls.start({
      scale: [1, 1.5, 1],
      rotate: [0, 10, -10, 10, -10, 0],
      transition: { duration: 0.5 },
    });

    if (onComplete) {
      onComplete();
    }
  };

  const checkCompletion = () => {
    if (isComplete) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const totalPixels = pixels.length / 4;
      let clearPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
      }

      const percentage = (clearPixels / totalPixels) * 100;

      if (percentage >= minScratchPercentage) {
        setIsComplete(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';  // Hide the canvas when complete
        startAnimation();
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative select-none w-full h-full", className)}
      style={{
        cursor: isComplete
          ? "default"
          : "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgc3R5bGU9ImZpbGw6I2ZmZjtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MXB4OyIgLz4KPC9zdmc+'), auto",
      }}
      animate={controls}
    >
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 w-full h-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      ></canvas>
      {children}
    </motion.div>
  );
};

export default ScratchToReveal;