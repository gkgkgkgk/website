'use client';

import React, { useState, useEffect } from 'react';

export default function ResumeViewer() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <>
            <button
                className="view-resume-btn"
                onClick={open}
                aria-label="View Resume"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
                View Resume
            </button>

            {isOpen && (
                <>
                    <div className="resume-backdrop" onClick={close} />
                    <div className="resume-modal-container">
                        <div className="resume-modal">
                            <button
                                className="resume-modal-close"
                                onClick={close}
                                aria-label="Close resume viewer"
                            >
                                ✕
                            </button>
                            <iframe
                                src="/resume.html"
                                title="Resume"
                                className="resume-iframe"
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
