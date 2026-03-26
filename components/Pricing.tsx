"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

const Pricing: React.FC = () => {
    const tiers = [
        { label: "Tier 01", title: "Foundation Module", subtitle: "9th Class", price: "500", features: ["Concept Clarity", "Weekly Assessment", "Mental Ability Training"] },
        { label: "Tier 02", title: "Board Excellence", subtitle: "10th Class", price: "800", features: ["Board Strategy", "PYQ Analysis", "Science & Math Mastery"] },
        { label: "Tier 03", title: "Strategic Prep", subtitle: "11th Class", price: "1,200", features: ["Entrance Foundation", "Logical Reasoning", "Profile Building"] },
        { label: "Tier 04", title: "Career Mastery", subtitle: "12th Class", price: "1,500", features: ["Board Coaching", "GD/PI Readiness", "Mock Interviews"] },
    ];

    return (
        <section className="pricing container">
        <div className="section-header">
            <h2 className="text-3xl font-bold">Course Enrollment Tiers</h2>
            <p className="text-zinc-400">Select your tier to unlock absolute academic dominance.</p>
        </div>
        <div className="pricing-grid grid-12">
            {tiers.map((tier, i) => (
                <div key={i} className="pricing-card glass-card interactive col-span-12 md:col-span-3">
                    <div className="pricing-header">
                        <span className="tier-label">{tier.label}</span>
                        <h3 className="pricing-title">{tier.title}</h3>
                        <p className="pricing-subtitle">{tier.subtitle}</p>
                    </div>
                    <div className="pricing-price cyber-green">₹{tier.price}<span>/mo</span></div>
                    <ul className="pricing-features">
                        {tier.features.map((f, j) => (
                            <li key={j}><CheckCircle2 size={18} className="text-green-400" /> {f}</li>
                        ))}
                    </ul>
                    <div className="pricing-action">
                        <button className="btn btn-purchase btn-block">Purchase Now</button>
                    </div>
                </div>
            ))}
        </div>
    </section>
    );
};

export default Pricing;
