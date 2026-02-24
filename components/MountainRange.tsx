"use client";

import React, { useRef, useEffect } from 'react';

// Seeded PRNG for deterministic noise across renders
function mulberry32(seed: number) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// Simple 1D Perlin noise with seeded permutation
function perlinNoise(seed: number) {
    const rng = mulberry32(seed);
    const permutation: number[] = [];
    for (let i = 0; i < 256; i++) permutation[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    const perm = [...permutation, ...permutation];

    function fade(t: number) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function lerp(a: number, b: number, t: number) {
        return a + t * (b - a);
    }
    function grad(hash: number, x: number) {
        return hash & 1 ? -x : x;
    }

    return function noise1D(x: number): number {
        const xi = Math.floor(x) & 255;
        const xf = x - Math.floor(x);
        const u = fade(xf);
        return lerp(grad(perm[xi], xf), grad(perm[xi + 1], xf - 1), u);
    };
}

// Generate a mountain profile using layered (octave) Perlin noise
function generateMountainProfile(
    width: number,
    octaves: number,
    baseFrequency: number,
    amplitude: number,
    persistence: number,
    offsetX: number,
    noise1D: (x: number) => number
): number[] {
    const profile: number[] = [];
    for (let x = 0; x < width; x++) {
        let value = 0;
        let freq = baseFrequency;
        let amp = amplitude;
        for (let o = 0; o < octaves; o++) {
            value += noise1D((x + offsetX) * freq) * amp;
            freq *= 2;
            amp *= persistence;
        }
        profile.push(value);
    }
    return profile;
}

interface MountainLayer {
    baseHeight: number;
    amplitude: number;
    baseFrequency: number;
    octaves: number;
    persistence: number;
    color: string;
    offsetX: number;
}

const LAYERS: MountainLayer[] = [
    {
        baseHeight: 0.18,
        amplitude: 200,
        baseFrequency: 0.0035,
        octaves: 6,
        persistence: 0.5,
        color: '#6a8f9e',
        offsetX: 1000,
    },
    {
        baseHeight: 0.12,
        amplitude: 180,
        baseFrequency: 0.002,
        octaves: 6,
        persistence: 0.48,
        color: '#3d5c6a',
        offsetX: 5000,
    },
    {
        baseHeight: 0.05,
        amplitude: 165,
        baseFrequency: 0.0015,
        octaves: 6,
        persistence: 0.45,
        color: '#294753ff',
        offsetX: 500,
    },
    {
        baseHeight: 0.03,
        amplitude: 155,
        baseFrequency: 0.001,
        octaves: 6,
        persistence: 0.45,
        color: '#1a2f38',
        offsetX: 0,
    }
];

export default function MountainRange() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const noiseRef = useRef<((x: number) => number) | null>(null);

    useEffect(() => {
        if (!noiseRef.current) {
            noiseRef.current = perlinNoise(Math.floor(Math.random() * 1000) + 1);
        }
        const noise1D = noiseRef.current;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const draw = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const dpr = window.devicePixelRatio || 1;
            const width = parent.clientWidth;
            const height = parent.clientHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, width, height);

            // Draw each mountain layer back-to-front
            for (const layer of LAYERS) {
                const profile = generateMountainProfile(
                    width,
                    layer.octaves,
                    layer.baseFrequency,
                    layer.amplitude,
                    layer.persistence,
                    layer.offsetX,
                    noise1D
                );

                // Normalize profile to [0, 1] range
                const minVal = Math.min(...profile);
                const maxVal = Math.max(...profile);
                const range = maxVal - minVal || 1;
                const normalized = profile.map(v => (v - minVal) / range);

                // Convert to screen Y coordinates
                const baseY = height - height * layer.baseHeight;
                const screenY = normalized.map(n => baseY - n * layer.amplitude);

                // --- Draw mountain fill ---
                ctx.beginPath();
                ctx.moveTo(0, height);
                for (let x = 0; x < width; x++) {
                    ctx.lineTo(x, screenY[x]);
                }
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fillStyle = layer.color;
                ctx.fill();
            }
        };

        draw();

        const handleResize = () => draw();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
}
