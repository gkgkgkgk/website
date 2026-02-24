"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: string;
    periods: {
        date: string;
        role: string;
        description: string;
    }[];
}

export default function Modal({ isOpen, onClose, company, periods }: ModalProps) {
    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="modal-container"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <div className="modal-content">
                            <button className="modal-close" onClick={onClose} aria-label="Close modal">
                                ✕
                            </button>

                            <div className="modal-header">
                                <h2>{company}</h2>
                            </div>

                            <div className="modal-body">
                                {periods.map((period, index) => (
                                    <div key={index} className="modal-period" style={{ marginBottom: index !== periods.length - 1 ? '2rem' : 0 }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <p className="modal-role">{period.role}</p>
                                            <p className="modal-date">{period.date}</p>
                                        </div>
                                        <p>{period.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
