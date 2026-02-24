"use client";

import React, { useEffect, useRef } from 'react';

export default function WaveDivider() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Config
    const pointsCount = 200;
    const height = 100;
    const centerY = height / 2;
    const baseAmplitude = 30;
    const frequency = 10.0; // Shorter wavelength as requested (higher frequency)
    const speed = 0.05;

    // Simulation State Refs (Mutable)
    const stateRef = useRef({
        phase: 0,
        // Current simulation state
        points: new Array(pointsCount).fill(centerY),
        // Previous simulation state (for interpolation)
        prevPoints: new Array(pointsCount).fill(centerY),

        waveType: 'sine' as 'sine' | 'square' | 'sawtooth',
        isResting: false,
        lastSwitchTime: 0,
        burstDuration: 2000,
        restDuration: 5000,
        currentSourceY: centerY,

        // Amplitude Randomization
        currentAmplitude: baseAmplitude,
        targetAmplitude: baseAmplitude,
        lastAmplitudeChangeTime: 0,

        // Time tracking
        lastFrameTime: 0,
        accumulatedTime: 0
    });

    const satelliteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = height;
        };

        resize();
        window.addEventListener('resize', resize);

        // Initialize time
        const now = performance.now();
        stateRef.current.lastSwitchTime = now;
        stateRef.current.lastFrameTime = now;

        const animate = (time: number) => {
            const state = stateRef.current;

            // --- SATELLITE ANIMATION ---
            // Bobbing motion: sin wave
            // Period: 6000ms (same as css)
            // Amplitude: 5px
            const bobOffset = Math.sin(time / 1000) * 5;
            const rotation = Math.sin(time / 1000) * 2; // +/- 2 degrees

            if (satelliteRef.current) {
                satelliteRef.current.style.transform = `translateY(${bobOffset}px) rotate(${rotation}deg)`;
            }

            // Calculate delta time
            // Limit delta time to avoid huge jumps
            const rawDelta = time - state.lastFrameTime;
            const deltaTime = Math.min(rawDelta, 50);
            state.lastFrameTime = time;

            state.accumulatedTime += deltaTime;

            // Fixed Physics Step (60 Hz)
            const FIXED_STEP = 16.667;

            // Consume time in fixed steps
            while (state.accumulatedTime >= FIXED_STEP) {
                // Save previous state for interpolation
                // create new array or copy? Copying is safer.
                state.prevPoints = [...state.points];

                // --- UPDATE PHYSICS (Same logic as before) ---
                const timeScale = 1.0; // Fixed step means scale is always 1 logic-wise w.r.t step

                // Update Phase (Speed correction)
                state.phase += speed * timeScale;

                // Helper to get time since switch based on current time approximation
                // Ideally simulation time should be tracked separately from wall clock
                // But for this visual, we'll just check conditions.

                const now = performance.now(); // Using wall clock for macroscopic events is fine
                const timeSinceSwitch = now - state.lastSwitchTime;

                // Logic: Burst (active) -> Rest (0) -> Burst (new type)
                if (!state.isResting && timeSinceSwitch > state.burstDuration) {
                    state.isResting = true;
                    state.lastSwitchTime = now;
                    state.restDuration = 3000;
                } else if (state.isResting && timeSinceSwitch > state.restDuration) {
                    state.isResting = false;
                    state.lastSwitchTime = now;

                    const types: ('sine' | 'square' | 'sawtooth')[] = ['sine', 'square', 'sawtooth'];
                    state.waveType = types[Math.floor(Math.random() * types.length)];

                    state.burstDuration = 1000;
                }

                // Amplitude Logic
                // Change target amplitude every few hundred ms
                if (!state.isResting && now - state.lastAmplitudeChangeTime > 200) {
                    // Randomize amplitude between 0.5x and 1.2x base
                    const scale = 0.5 + Math.random();
                    state.targetAmplitude = baseAmplitude * scale;
                    state.lastAmplitudeChangeTime = now;
                }

                // Smoothly interpolate current amplitude to target
                // Lerp factor
                // simple iterative smoothing: current += (target - current) * factor
                // To make independent of framerate: factor = 1 - pow(1 - baseFactor, timeScale)
                const baseAmpSmoothing = 0.1;
                state.currentAmplitude += (state.targetAmplitude - state.currentAmplitude) * baseAmpSmoothing;

                // Calculate Target Source Y
                let targetY = 0;

                if (state.isResting) {
                    targetY = 0;
                } else {
                    const t = state.phase;
                    const k = frequency;
                    const amp = state.currentAmplitude;

                    switch (state.waveType) {
                        case 'sine':
                            targetY = Math.sin(t * k) * amp;
                            break;
                        case 'square':
                            targetY = Math.sign(Math.sin(t * k)) * amp;
                            break;
                        case 'sawtooth':
                            targetY = -(((t * k / (2 * Math.PI)) % 1) * 2 - 1) * amp;
                            break;
                    }
                }

                const baseSmoothing = 0.2;
                // Physics now only tracks the SIGNAL (wave), not the satellite bobbing position.
                // The bobbing is applied at render time to the whole line/baseline.
                state.currentSourceY += (targetY - state.currentSourceY) * baseSmoothing;

                // Propagate Wave
                state.points.pop();
                state.points.unshift(state.currentSourceY);

                state.accumulatedTime -= FIXED_STEP;
            }

            // --- INTERPOLATION ---
            // Alpha is how far we are between the last physics step and the next one
            const alpha = state.accumulatedTime / FIXED_STEP;

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create Gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(160, 216, 255, 1.0)'); // Fade in Start
            gradient.addColorStop(0.05, '#a7e3ffff'); // Full color soon after start
            gradient.addColorStop(0.95, '#a7e3ffff'); // Full color until near end
            gradient.addColorStop(1, 'rgba(160, 216, 255, 1.0)'); // Fade out End

            ctx.beginPath();

            const segmentWidth = canvas.width / (pointsCount - 1);

            // Taper logic: 
            // 1. Start: 0 at index 0 (nozzle), ramp up to 1 by 15% (ease in wave)
            // 2. End: Ramp down to 0 at last 10%
            const getTaper = (i: number) => {
                const p = i / (pointsCount - 1);
                if (p < 0.15) return p / 0.15; // Ease in signal from nozzle
                if (p > 0.9) return (1 - p) / 0.1; // Ease out at end
                return 1;
            };

            // Interpolate between prev and current
            const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

            // Render the line
            // We apply the bobOffset to the BASELINE (centerY)
            // y = (CenterY + Bob) + (Signal * Taper)
            const globalYOffset = centerY + bobOffset;

            // Move to first point
            const signal0 = lerp(state.prevPoints[0], state.points[0], alpha);
            const y0 = globalYOffset + signal0 * getTaper(0);
            ctx.moveTo(0, y0);

            for (let i = 1; i < pointsCount; i++) {
                const taper = getTaper(i);

                // Interpolated value for this point
                const currentVal = state.points[i];
                const prevVal = state.prevPoints[i];
                const signal = lerp(prevVal, currentVal, alpha);

                const y = globalYOffset + signal * taper;
                ctx.lineTo(i * segmentWidth, y);
            }

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2; // Matches satellite emitter thickness
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#a0d8ff';
            ctx.stroke();

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div ref={containerRef} className="wave-divider-container" style={{
            width: '100%',
            // maxWidth: '1000px', 
            height: `${height}px`,
            margin: '4rem auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            {/* Satellite SVG */}
            <div
                ref={satelliteRef}
                style={{
                    marginRight: '-2px', // Ensure overlap
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    filter: 'drop-shadow(0 0 8px rgba(160, 216, 255, 0.3))',
                    // transform is now managed by JS
                }}>
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                // Removed className="satellite-icon" to stop CSS animation
                >
                    <g transform="translate(0, 0)">
                        {/* Right Panel (HINT) - Visible behind body to resemble the 2nd wing */}
                        <path
                            d="M38 18 L50 15 L50 65 L38 62"
                            fill="rgba(20, 40, 80, 0.9)"
                            stroke="#1488cc"
                            strokeWidth="1"
                        />

                        {/* Left Solar Panel - Grid Pattern */}
                        <path
                            d="M5 20 L25 15 L25 65 L5 60 Z"
                            fill="rgba(10, 30, 60, 0.9)" /* Dark Blue Solar Cell Color */
                            stroke="#1488cc"
                            strokeWidth="1.5"
                        />
                        {/* Grid lines on panel */}
                        <path d="M5 33 L25 31" stroke="#1488cc" strokeWidth="0.5" strokeOpacity="0.7" />
                        <path d="M5 47 L25 48" stroke="#1488cc" strokeWidth="0.5" strokeOpacity="0.7" />
                        <path d="M15 18 L15 62" stroke="#1488cc" strokeWidth="0.5" strokeOpacity="0.7" />

                        {/* Connector strut */}
                        <line x1="25" y1="40" x2="32" y2="40" stroke="#a0d8ff" strokeWidth="3" />

                        {/* Main Body - Metallic Sci-fi Box */}
                        <rect x="32" y="28" width="24" height="24" rx="1" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />

                        {/* Body Details (Foil/Tech) */}
                        <rect x="35" y="31" width="8" height="8" fill="#334155" rx="0.5" />
                        <rect x="35" y="41" width="8" height="8" fill="#334155" rx="0.5" />
                        <rect x="46" y="31" width="7" height="18" fill="rgba(160, 216, 255, 0.15)" rx="0.5" stroke="none" />

                        {/* Blinking Red Light */}
                        <circle cx="39" cy="35" r="2" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>

                        {/* Dish / Antenna System */}
                        {/* Base of dish */}
                        <path d="M56 36 L62 25 L64 27 L58 40" fill="#334155" stroke="#94a3b8" strokeWidth="1" />


                        {/* Feed / Emitter */}
                        <line x1="56" y1="40" x2="80" y2="40" stroke="#a0d8ff" strokeWidth="2" />
                        {/* Tip - Connection Point */}
                        <circle cx="80" cy="40" r="5" fill="#a0d8ff">
                            <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </svg>
            </div>

            {/* Canvas Wrapper */}
            <div style={{ flexGrow: 1, height: '100%', position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
}

