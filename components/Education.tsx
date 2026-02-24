import React from 'react';
import Image from 'next/image';

export default function Education() {
    return (
        <div className="education-section">
            <h2>Education</h2>

            <div className="university-header">
                <Image
                    src="https://github.com/gkgkgkgk/website/blob/main/public/logos/Cooper.png?raw=true"
                    alt="The Cooper Union logo"
                    width={80}
                    height={80}
                    className="education-logo"
                />
                <h3>
                    <a href="https://cooper.edu" target="_blank" rel="noopener noreferrer" className="education-link">
                        The Cooper Union for the Advancement of Science and Art
                    </a>
                </h3>
                <p className="location">New York, NY</p>
            </div>

            <div className="degrees-grid">
                <div className="degree-card">
                    <div className="degree-info">
                        <h4>Master of Engineering <br /><span style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>in</span> <br /> Electrical Engineering</h4>
                        <span className="date">May 2024</span>
                    </div>
                    <div className="degree-actions">
                        <a href="https://www.proquest.com/docview/3054139481/8B21866B967E4DFBPQ/2" target="_blank" rel="noopener noreferrer" className="action-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            View Thesis
                        </a>
                    </div>
                </div>

                <div className="degree-card">
                    <div className="degree-info">
                        <h4>Bachelor of Engineering <br /><span style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>in</span> <br />Electrical Engineering</h4>
                        <span className="minor">Minor in Computer Science</span>
                        <span className="date">May 2023</span>
                    </div>
                    <div className="degree-actions">
                        <a href="https://pathplanning.online/" target="_blank" rel="noopener noreferrer" className="action-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                            Capstone Project
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
