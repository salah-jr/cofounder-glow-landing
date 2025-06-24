"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "AI Co-Founder",
    title1 = "Your startup, from idea to launch,",
    title2 = "in hours.",
    subtitle = "Co-founder is your AI business partner. From idea → to pitch deck → to MVP. All in one tool.",
    children,
    fullPage = false,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    subtitle?: string;
    children?: React.ReactNode;
    fullPage?: boolean;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className={cn(
            "relative w-full flex items-center justify-center overflow-hidden",
            "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]",
            fullPage ? "min-h-screen" : "min-h-screen"
        )}>
            {/* Enhanced background with more blues */}
            <div className="absolute inset-0">
                {/* Primary gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/[0.08] via-[#1e40af]/[0.06] to-[#1EAEDB]/[0.08]" />
                
                {/* Secondary blue gradient layers */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/[0.04] via-transparent to-[#06b6d4]/[0.06]" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#1d4ed8]/[0.03] via-transparent to-[#0ea5e9]/[0.05]" />
                
                {/* Radial gradients for depth */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3b82f6]/[0.08] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1EAEDB]/[0.08] rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#06b6d4]/[0.06] rounded-full blur-2xl" />
                <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#0ea5e9]/[0.07] rounded-full blur-3xl" />
            </div>

            <div className="absolute inset-0 overflow-hidden">
                {/* Enhanced shapes with more blue variations */}
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-[#9b87f5]/[0.18]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-[#1EAEDB]/[0.18]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-[#3b82f6]/[0.16]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-[#06b6d4]/[0.16]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-[#0ea5e9]/[0.16]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />

                {/* Additional blue shapes for more depth */}
                <ElegantShape
                    delay={0.8}
                    width={250}
                    height={70}
                    rotate={35}
                    gradient="from-[#1d4ed8]/[0.14]"
                    className="right-[5%] md:right-[10%] bottom-[20%] md:bottom-[25%]"
                />

                <ElegantShape
                    delay={0.9}
                    width={180}
                    height={50}
                    rotate={-30}
                    gradient="from-[#2563eb]/[0.14]"
                    className="left-[30%] md:left-[35%] top-[60%] md:top-[65%]"
                />

                <ElegantShape
                    delay={1.0}
                    width={120}
                    height={35}
                    rotate={45}
                    gradient="from-[#0284c7]/[0.14]"
                    className="right-[30%] md:right-[35%] top-[40%] md:top-[45%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                    >
                        <Circle className="h-2 w-2 fill-[#9b87f5]/80" />
                        <span className="text-sm text-white/60 tracking-wide">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] via-[#3b82f6] to-[#1EAEDB]"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Content area for prompt section */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-3xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>

            {/* Enhanced gradient overlay with blue tints */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/60 pointer-events-none" />
            
            {/* Additional atmospheric effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(30,174,219,0.05),transparent_50%)] pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }