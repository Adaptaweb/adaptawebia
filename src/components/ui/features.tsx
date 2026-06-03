"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FeaturesProps {
  features: {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
    image: string;
  }[];
}

export function Features({ features }: FeaturesProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress]);

  useEffect(() => {
    const activeFeatureElement = featureRefs.current[currentFeature];
    const container = containerRef.current;
    if (activeFeatureElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeFeatureElement.getBoundingClientRect();
      container.scrollTo({
        left:
          activeFeatureElement.offsetLeft -
          (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 lg:gap-16 gap-8 items-center">
        <div
          ref={containerRef}
          className="lg:space-y-6 md:space-x-6 lg:space-x-0 overflow-x-auto overflow-hidden lg:overflow-visible flex lg:flex lg:flex-col flex-row order-1 pb-4 scroll-smooth"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = currentFeature === index;

            return (
              <div
                key={feature.id}
                ref={(el) => { featureRefs.current[index] = el; }}
                className="relative cursor-pointer flex-shrink-0"
                onClick={() => handleFeatureClick(index)}
              >
                <div
                  className={cn(
                    "flex lg:flex-row flex-col items-start gap-4 p-4 max-w-sm md:max-w-sm lg:max-w-2xl transition-all duration-300 rounded-2xl",
                    isActive
                      ? "bg-secondary/10 backdrop-blur-xl border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                      : ""
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-all duration-300 hidden md:block",
                      isActive
                        ? "bg-primary/10 border border-primary/20 text-primary"
                        : "bg-white/5 border border-white/10 text-text-muted"
                    )}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-lg md:mt-4 lg:mt-0 font-semibold mb-2 transition-colors duration-300",
                        isActive ? "text-text-primary" : "text-text-muted"
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm transition-colors duration-300 leading-relaxed",
                        isActive ? "text-text-muted" : "text-text-dim"
                      )}
                    >
                      {feature.description}
                    </p>
                    <div className="mt-4 bg-white/5 rounded-full h-1 overflow-hidden">
                      {isActive && (
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary/50 to-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative order-1 max-w-lg mx-auto lg:order-2">
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden border border-white/5 bg-secondary/10 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <img
              className="w-full h-auto aspect-[3/2] object-cover"
              src={features[currentFeature].image}
              alt={features[currentFeature].title}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
