import React from 'react';
import Image from 'next/image';
import Starfield from '@/components/Starfield';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import WaveDivider from '@/components/WaveDivider';
import MountainRange from '@/components/MountainRange';
import Projects from '@/components/Projects';
import DriftingClouds from '@/components/DriftingClouds';

export default function Portfolio() {
  return (
    <main style={{ position: 'relative' }}>
      {/* Global Starfield reaching through the second section */}
      <Starfield count={400} height="220vh" />

      {/* Space Section */}
      <section className="section-space">
        <div className="content-wrapper">
          <p>Hi, I&apos;m</p>
          <h1>Gavri Kepets</h1>
          <Image
            src="/profile_pic.png"
            alt="Gavri Kepets"
            width={300}
            height={300}
            className="profile-pic"
            priority
          />
          <p>I am currently a software engineer at BNY&apos;s AI Hub.</p>
        </div>
      </section>

      {/* Atmosphere Section */}
      <section className="section-atmosphere">
        <div className="content-wrapper wide">
          <h2>Work Experience</h2>
          <Experience />

          <WaveDivider />

          <Education />
        </div>
      </section>

      {/* Mountains Section */}
      <section className="section-mountains">
        <DriftingClouds />
        <div className="content-wrapper wide" style={{ paddingBottom: '10vh', zIndex: 10, position: 'relative' }}>
          <h2>Projects</h2>
          <Projects />
        </div>
        <MountainRange />
      </section>
    </main>
  );
}
