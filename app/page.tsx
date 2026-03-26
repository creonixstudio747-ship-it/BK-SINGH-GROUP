"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Book, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Calculator, 
  FlaskConical, 
  Globe2,
  MapPin,
  Navigation,
  Maximize2,
  Zap,
  PlayCircle,
  Clock,
  CheckCircle2,
  Hexagon
} from "lucide-react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import LearningHub from "../components/LearningHub";
import Pricing from "../components/Pricing";
import YouTubeFeed from "../components/YouTubeFeed";
import Location from "../components/Location";
import Leadership from "../components/Leadership";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <main>
        {/* Background Elements */}
        <div className="bg-noise"></div>
        <div className="bg-glow blob-1"></div>
        <div className="bg-glow blob-2"></div>

        {/* Hero Section */}
        <section className="hero container">
          <div className="hero-content">
            <div className="badge">Elevate Your Career</div>
            <h1 className="hero-title">
              B.K. Singh Classes:<br />
              <span className="highlight">The Gold Standard of Academic Excellence.</span>
            </h1>
            <p className="hero-subtitle">
              India’s Elite Learning Ecosystem for Classes 9th to 12th. Master your School
              Boards and Competitive Foundations with Precision and Luxury.
            </p>
            <div className="hero-actions">
              <button onClick={() => user ? window.location.href='/dashboard' : setIsAuthModalOpen(true)} className="btn btn-primary">
                {user ? "Go to Dashboard" : "Start Your Journey"} <ArrowRight size={18} />
              </button>
              <a href="#expertise" className="btn btn-secondary flex items-center gap-2">Explore Programs</a>
            </div>
          </div>

          <div className="dashboard-live-ui glass-card interactive">
             <div className="dashboard-nav">
                <div className="dash-logo flex items-center gap-2">
                    <GraduationCap size={18} /> B.K. Singh Classes
                </div>
                <div className="dash-links">
                    <span className="active flex items-center gap-1 opacity-50"><ArrowRight size={14} /> Dashboard</span>
                    <span className="flex items-center gap-1 opacity-50"><BookOpen size={14} /> My Courses</span>
                </div>
                <div className="dash-user">
                    <div className="dash-avatar"><Users size={16} /></div>
                </div>
            </div>
            <div className="dashboard-grid h-48 flex items-center justify-center border-t border-white/5 opacity-50">
               <p className="text-zinc-500 font-medium italic">Experience the gold standard of education management</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats container">
          <div className="stats-grid grid-12">
            {[
              { label: "Successful Placements", value: "15.2K+", icon: <TrendingUp /> },
              { label: "Active Aspirants", value: "27.5K+", icon: <Users /> },
              { label: "Success Ratio", value: "98.4%", icon: <Target /> },
              { label: "Educational Excellence", value: "20+ Years", icon: <Award /> },
            ].map((stat, i) => (
              <div key={i} className="stat-card glass-card interactive col-span-12 md:col-span-3">
                <div className="stat-icon cyber-green">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Modules Section */}
        <section id="expertise" className="modules container">
          <div className="section-header">
            <h2 className="text-3xl font-bold">Our Expertise</h2>
            <p className="text-zinc-400">Curated pathways to board mastery and academic dominance</p>
          </div>
          <div className="modules-grid grid-12">
            {[
              { title: "Class 9th Foundation", desc: "Build a rock-solid academic foundation with conceptual clarity and advanced reasoning skills.", icon: <Book /> },
              { title: "Class 10th Board Mastery", desc: "Strategic board exam preparation with specialized focus on scoring perfect percentiles.", icon: <BookOpen /> },
              { title: "Class 11th Advanced Concepts", desc: "Deep-dive into specialized subjects logically structured for your intermediate educational journey.", icon: <Compass /> },
              { title: "Class 12th Career & Board Excellence", desc: "Comprehensive final board coaching paired with competitive entrance readiness.", icon: <GraduationCap /> },
            ].map((mod, i) => (
              <div key={i} className="module-card glass-card interactive col-span-12 md:col-span-6">
                <div className="module-content">
                  <h3 className="module-title">{mod.title}</h3>
                  <p className="module-desc">{mod.desc}</p>
                </div>
                <div className="module-icon">{mod.icon}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Hub */}
        <LearningHub />

        {/* Pricing */}
        <Pricing />

        {/* YouTube Feed */}
        <YouTubeFeed />

        {/* Methodology */}
        <section className="methodology container">
            <div className="section-header">
                <h2 className="text-3xl font-bold">The B.K. Singh Methodology</h2>
                <p className="text-zinc-400">A proven, systematic progression framework</p>
            </div>
            <div className="methodology-steps">
                {[
                    { id: "01", title: "Profile Assessment" },
                    { id: "02", title: "Conceptual Foundations" },
                    { id: "03", title: "Rigorous Testing" },
                    { id: "04", title: "Personality Refinement" },
                    { id: "05", title: "Final Placement", highlight: true },
                ].map((step, i) => (
                    <React.Fragment key={i}>
                        <div className="step">
                            <div className={`step-circle glass-card ${step.highlight ? "cyber-focus" : ""}`}>{step.id}</div>
                            <div className={`step-title ${step.highlight ? "cyber-text" : ""}`}>{step.title}</div>
                        </div>
                        {i < 4 && <div className="hidden md:block step-arrow"><ArrowRight size={16} /></div>}
                    </React.Fragment>
                ))}
            </div>
        </section>

        {/* Location Section */}
        <Location />

        {/* Leadership Section */}
        <Leadership />
      </main>

      <footer className="container py-12">
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="logo flex items-center gap-2">
            <Hexagon className="logo-icon text-green-400" />
            <span className="font-bold tracking-widest">B.K. SINGH CLASSES</span>
          </div>
          <div className="copyright text-zinc-500 text-sm">
            © {new Date().getFullYear()} B.K. Singh Group. All rights reserved.
          </div>
          <div className="flex gap-6 text-zinc-400 text-sm">
            <Link href="#" className="hover:text-green-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-green-400">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
