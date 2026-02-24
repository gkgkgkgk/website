"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

export default function Starfield({ count = 300, height = "100%" }: { count?: number; height?: string }) {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        // Generate star positions only on the client to avoid hydration mismatches
        const newStars = Array.from({ length: count }).map((_, i) => {
            const duration = Math.random() * 3 + 2; // 2s to 5s
            // Use power loading for Y to dwindle stars at the bottom
            // y = r^1.5 * 100. This clusters at 0 (top).
            // r is 0..1.
            const r = Math.random();
            const y = Math.pow(r, 1.5) * 100;

            return {
                id: i,
                x: Math.random() * 100, // percentage
                y: y, // percentage
                size: Math.random() * 2 + 1, // 1px to 3px
                duration: duration,
                delay: -1 * Math.random() * duration,
            };
        });
        setStars(newStars);
    }, [count]);

    return (
        <div
            aria-hidden="true"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: height,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 1, // Sit above background but below content (z-10)
            }}
        >
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    style={{
                        position: "absolute",
                        left: `${star.x}%`, // Use left/top for static stars
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        backgroundColor: "white",
                        borderRadius: "50%",
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.delay,
                    }}
                />
            ))}

            <ShootingStarSystem />
        </div>
    );
}

function ShootingStarSystem() {
    const [shootingStar, setShootingStar] = useState<{
        id: number;
        x: number;
        y: number;
        angle: number;
        scale: number
    } | null>(null);

    useEffect(() => {
        const scheduleNextStar = () => {
            // Random delay 
            const delay = Math.random() * 4000 + 3000;

            setTimeout(() => {
                const id = Date.now();
                // Spawn in top 30% 
                const x = Math.random() * 90;
                const y = Math.random() * 20;
                // Random angle: mostly falling down-right or down-left
                // 45deg is diagonal down-right.
                // Range: 10deg (flat-ish) to 80deg (steep)
                const angle = Math.random() * 60 + 15;
                const scale = Math.random() * 0.5 + 0.5;

                setShootingStar({ id, x, y, angle, scale });

                setTimeout(() => {
                    setShootingStar(null);
                    scheduleNextStar();
                }, 2000);
            }, delay);
        };

        scheduleNextStar();
    }, []);

    if (!shootingStar) return null;

    // Calculate endpoint based on angle
    // angle is degrees clockwise from horizontal right.
    const dist = 500;
    const rad = shootingStar.angle * (Math.PI / 180);
    const dx = Math.cos(rad) * dist;
    const dy = Math.sin(rad) * dist;

    return (
        <motion.div
            key={shootingStar.id}
            initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: shootingStar.scale,
                rotate: shootingStar.angle
            }}
            animate={{
                x: dx,
                y: dy,
                opacity: [0, 1, 0],
                rotate: shootingStar.angle
            }}
            transition={{
                x: { duration: 0.8, ease: "linear" },
                y: { duration: 0.8, ease: "linear" },
                rotate: { duration: 0 }, // Constant
                opacity: { duration: 0.8, times: [0, 0.2, 1], ease: "easeOut" }
            }}
            style={{
                position: "absolute",
                left: `${shootingStar.x}%`,
                top: `${shootingStar.y}%`,
                // transform: handled by motion props
                zIndex: 10,
            }}
        >
            {/* The Star System Container - Rotated Grid */}
            {/* Since parent has transform, this inner content is in local space */}

            {/* Head */}
            <div style={{
                position: 'absolute',
                top: -2,
                left: -2, // Center the 4px dot
                width: '4px',
                height: '4px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: "0 0 8px 3px rgba(255, 255, 255, 0.8)",
            }} />

            {/* Tail */}
            {/* Grows backwards (negative X) */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0, // Anchored to the head (which is at 0,0 roughly)
                    height: '1px',
                    background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
                    transformOrigin: "right center", // Grow to the left
                }}
                animate={{
                    width: [0, 150, 0],
                }}
                transition={{
                    duration: 0.8,
                    ease: "easeInOut", // Tail length eases
                    times: [0, 0.3, 1]
                }}
            />
        </motion.div>
    );
}
