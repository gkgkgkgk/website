"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import experienceData from '@/data/experience.json';
import Modal from './Modal';

interface Period {
    date: string;
    role: string;
    shortDescription: string;
    description: string;
}

interface ExperienceItem {
    id: number;
    title: string;
    company: string;
    companyUrl: string;
    logo: string;
    location: string;
    current?: boolean;
    periods: Period[];
}

interface ModalData {
    company: string;
    periods: Period[];
}

export default function Experience() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const currentJobs = experienceData.filter(item => item.current);
    const pastJobs = experienceData.filter(item => !item.current);

    const openModal = (company: string, periods: Period[]) => {
        setModalData({
            company,
            periods
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const ExperienceCard = ({ item }: { item: ExperienceItem }) => (
        <div key={item.id} className={`experience-card ${item.current ? 'current-job' : ''}`} style={{ height: '100%' }}>
            <div className="experience-header">
                {item.logo && (
                    <Image
                        src={item.logo}
                        alt={`${item.company} logo`}
                        width={48}
                        height={48}
                        className="company-logo"
                    />
                )}
                <div>
                    <h3>
                        <a href={item.companyUrl} target="_blank" rel="noopener noreferrer">
                            {item.company}
                        </a>
                    </h3>
                    <span className="location">{item.location}</span>
                </div>
            </div>

            <div className="periods">
                {item.periods.map((period, index) => (
                    <div key={index} className="period">
                        <div className="period-header">
                            <span className="date">{period.date}</span>
                            <span className="role">{period.role}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="learn-more-btn"
                onClick={() => openModal(item.company, item.periods)}
                style={{ width: '100%', justifyContent: 'center' }}
            >
                Learn More →
            </button>
        </div>
    );

    return (
        <>
            <div className="experience-container">
                {/* Current Roles */}
                <div className="experience-grid current-section">
                    {currentJobs.map((item: ExperienceItem) => (
                        <ExperienceCard key={item.id} item={item} />
                    ))}
                </div>

                {/* Divider */}
                {currentJobs.length > 0 && pastJobs.length > 0 && (
                    <div className="experience-divider">
                        <div className="line"></div>
                        <span>Previous Experience</span>
                        <div className="line"></div>
                    </div>
                )}

                {/* Past Roles */}
                <div className="experience-grid past-section">
                    {pastJobs.map((item: ExperienceItem) => (
                        <ExperienceCard key={item.id} item={item} />
                    ))}
                </div>
            </div>

            {modalData && (
                <Modal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    company={modalData.company}
                    periods={modalData.periods}
                />
            )}
        </>
    );
}
