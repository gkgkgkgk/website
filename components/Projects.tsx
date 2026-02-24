"use client";

import React from 'react';
import Image from 'next/image';

interface Project {
    title: string;
    description: string;
    url: string;
    year: string;
    image?: string;
}

const projects: Project[] = [
    {
        title: "ApolloSim",
        description: "A LIDAR simulator built in Odin/OpenGL with calibrated sensor noise models, created as a Master's thesis project.",
        url: "https://www.proquest.com/docview/3054139481/8B21866B967E4DFBPQ/2",
        year: "2024",
        image: "/projects/apollosim.png",
    },
    {
        title: "Gnocchi",
        description: "An AI-powered recipe app that generates recipes based on dietary restrictions, allergies, and available ingredients.",
        url: "https://github.com/gkgkgkgk/gnocchi",
        year: "2025",
    },
    {
        title: "JourneyAI",
        description: "An AI-powered tool for organizing, planning, and writing papers. Sources are indexed for fact-checking, contradiction detection, and inline citations.",
        url: "https://github.com/gkgkgkgk/JourneyAI",
        year: "2026",
    },
    {
        title: "PB*",
        description: "A preference-based path-planning framework for autonomous robots that dynamically adjusts heuristics based on user preferences.",
        url: "https://pathplanning.online/",
        year: "2023",
        image: "/projects/pb_star.png",
    },
];

export default function Projects() {
    return (
        <div className="projects-container">
            {projects.map((project) => (
                <a
                    key={project.title}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card"
                >
                    <div className="project-card-img">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 700px) 100vw, 450px"
                            />
                        ) : null}
                        <span className="project-card-year">{project.year}</span>
                    </div>
                    <div className="project-card-body">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <span className="project-card-link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            View Project
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
}
