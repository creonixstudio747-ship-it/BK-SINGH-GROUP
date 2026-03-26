"use client";

import React, { useState } from "react";
import { Hexagon, LayoutDashboard, BookOpen, FileCheck2, Briefcase, PieChart, User, Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="container nav-container">
          <Link href="/" className="logo">
            <Hexagon className="logo-icon" />
            <span>B.K. SINGH CLASSES</span>
          </Link>
          
          <nav className="nav-links">
            <Link href="/dashboard" className="nav-item">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <a href="#courses" className="nav-item">
              <BookOpen size={18} /> My Courses
            </a>
            <a href="#mock-tests" className="nav-item">
              <FileCheck2 size={18} /> Mock Tests
            </a>
            <a href="#placement" className="nav-item">
              <Briefcase size={18} /> Placement Cell
            </a>
            <a href="#analytics" className="nav-item">
              <PieChart size={18} /> Analytics
            </a>
          </nav>

          <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {!user ? (
              <button onClick={onLoginClick} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
                <User size={18} /> Login / Sign Up
              </button>
            ) : (
              <div className="relative" style={{ position: "relative" }}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="nav-profile-cyber"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: "rgba(158,255,118,0.1)", border: "1px solid var(--cyber-green)", borderRadius: "8px", padding: "0.5rem 1rem", color: "var(--cyber-green)" }}
                >
                  <User size={18} /> 
                  <span>{user.displayName || user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} style={{ transform: profileDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="glass-card" 
                    style={{ 
                      position: "absolute", 
                      top: "120%", 
                      right: 0, 
                      width: "200px", 
                      zIndex: 100, 
                      padding: "0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}
                  >
                    <Link href="/profile" className="nav-item" style={{ padding: "0.75rem", borderRadius: "8px" }} onClick={() => setProfileDropdownOpen(false)}>
                       Profile
                    </Link>
                    <button 
                      onClick={() => { logout(); setProfileDropdownOpen(false); }} 
                      className="nav-item" 
                      style={{ padding: "0.75rem", borderRadius: "8px", width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", color: "#ff4444" }}
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay active">
          <div className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <i data-lucide="x"></i>
          </div>
          <nav className="mobile-nav-links">
            <Link href="/dashboard" className="nav-item mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard /> Dashboard
            </Link>
            <a href="#courses" className="nav-item mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <BookOpen /> My Courses
            </a>
            <a href="#mock-tests" className="nav-item mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <FileCheck2 /> Mock Tests
            </a>
            {!user ? (
              <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                <User /> Login / Sign Up
              </button>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="btn btn-secondary" style={{ marginTop: "1rem", color: "#ff4444" }}>
                <LogOut /> Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
