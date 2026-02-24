"use client";

import React from 'react';

interface CloudConfig {
    top: string;
    size: number;       // scale multiplier
    duration: number;    // seconds to cross
    delay: number;       // animation delay
    opacity: number;
}

const clouds: CloudConfig[] = [
    { top: '8%', size: 0.5, duration: 45, delay: 0, opacity: 0.5 },
    { top: '18%', size: 0.35, duration: 60, delay: -20, opacity: 0.35 },
    { top: '28%', size: 0.55, duration: 50, delay: -35, opacity: 0.4 },
    { top: '12%', size: 0.3, duration: 70, delay: -10, opacity: 0.3 },
    { top: '38%', size: 0.4, duration: 55, delay: -45, opacity: 0.45 },
    { top: '22%', size: 0.25, duration: 80, delay: -55, opacity: 0.25 },
    { top: '42%', size: 0.45, duration: 48, delay: -30, opacity: 0.35 },
    { top: '5%', size: 0.38, duration: 65, delay: -50, opacity: 0.3 },
];

export default function DriftingClouds() {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 2,
            }}
        >
            {clouds.map((c, i) => (
                <div
                    key={i}
                    className="drifting-cloud"
                    style={{
                        top: c.top,
                        animationDuration: `${c.duration}s`,
                        animationDelay: `${c.delay}s`,
                        opacity: c.opacity,
                        transform: `scale(${c.size})`,
                    }}
                >
                    {/* Cloud built from overlapping circles */}
                    <div className="drift-puff drift-p1" />
                    <div className="drift-puff drift-p2" />
                    <div className="drift-puff drift-p3" />
                    <div className="drift-body" />
                </div>
            ))}
        </div>
    );
}
