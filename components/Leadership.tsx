"use client";

import React from "react";
import { Zap, AlertTriangle } from "lucide-react";

const Leadership: React.FC = () => {
    return (
        <section className="leadership container pb-24">
            <div className="mentor-profile glass-card overflow-hidden flex flex-col md:flex-row gap-8 md:gap-16 p-8 md:p-16">
                <div className="mentor-image-wrapper shrink-0 w-full md:w-[350px]">
                    <div className="relative">
                        <img 
                            src="/assets/bksingh.jpg" 
                            alt="B.K. Singh, Founder & Chief Mentor"
                            className="mentor-image w-full rounded-2xl relative z-10 border border-white/10 shadow-2xl"
                        />
                        <div className="mentor-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[80px] rounded-full z-0"></div>
                    </div>
                </div>
                <div className="mentor-details flex-1">
                    <div className="mentor-header mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">B.K. Singh</h2>
                        <span className="mentor-title text-green-400 font-bold tracking-widest uppercase text-sm">Founder & Chief Mentor</span>
                    </div>
                    <div className="persona-section grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="persona-card glass-card-inner p-6">
                            <h4 className="flex items-center gap-2 font-bold mb-4 text-white">
                                <Zap className="text-green-400" size={20} /> Needs
                            </h4>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2"><span>→</span> Strategic Excellence in Education</li>
                                <li className="flex items-start gap-2"><span>→</span> Data-Driven Assessment Frameworks</li>
                                <li className="flex items-start gap-2"><span>→</span> Holistic Student Transformation</li>
                            </ul>
                        </div>
                        <div className="persona-card glass-card-inner p-6">
                            <h4 className="flex items-center gap-2 font-bold mb-4 text-white">
                                <AlertTriangle className="text-amber-500" size={20} /> Pain Points Solved
                            </h4>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2"><span>→</span> Standardized Education Gaps</li>
                                <li className="flex items-start gap-2"><span>→</span> Lack of Industry-Ready Skills</li>
                                <li className="flex items-start gap-2"><span>→</span> Inconsistent Assessment Models</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Leadership;
