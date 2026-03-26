"use client";

import React, { useState } from "react";
import { X, Mail, ArrowLeft, ArrowRight, Loader2, Hexagon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = "METHODS" | "EMAIL";

// ---------------------------------------------------------------------------
// Google SVG Icon (inline, no external fetch required)
// ---------------------------------------------------------------------------
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginWithGoogle } = useAuth();

  const [view, setView] = useState<View>("METHODS");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setView("METHODS");
    setIsSignUp(false);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Google ──────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email / Password ─────────────────────────────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (isSignUp) {
        await signup(email, password, name || email.split("@")[0]);
      } else {
        await login(email, password);
      }
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      // Make Firebase error messages friendlier
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Invalid email or password.");
      } else if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("weak-password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const title = view === "METHODS" ? "Access Portal" : isSignUp ? "Create Account" : "Welcome Back";
  const subtitle = view === "METHODS" ? "Choose your sign-in method." : "";

  return (
    <div
      className="auth-modal-overlay active"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="auth-modal glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="auth-close-btn" onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="auth-modal-header">
          <Hexagon className="logo-icon cyber-green" size={40} style={{ margin: "0 auto 1rem" }} />
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {/* ── METHODS VIEW ──────────────────────────────────────────────── */}
        {view === "METHODS" && (
          <div className="auth-state">
            <button
              className="auth-btn"
              onClick={handleGoogle}
              disabled={loading}
              style={{ gap: "0.75rem" }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>

            <div className="auth-divider"><span>OR</span></div>

            <button className="auth-btn" onClick={() => { setIsSignUp(false); setView("EMAIL"); }}>
              <Mail size={20} /> Sign In with Email
            </button>
            <button className="auth-btn" onClick={() => { setIsSignUp(true); setView("EMAIL"); }}>
              <Mail size={20} /> Create Account
            </button>
          </div>
        )}

        {/* ── EMAIL VIEW ────────────────────────────────────────────────── */}
        {view === "EMAIL" && (
          <div className="auth-state">
            <form onSubmit={handleEmailAuth}>
              {isSignUp && (
                <div className="input-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    className="auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rajveer Singh"
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="input-group" style={{ marginTop: isSignUp ? "1rem" : "0" }}>
                <label htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="input-group" style={{ marginTop: "1rem" }}>
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                style={{ marginTop: "1.5rem" }}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <button
              className="btn btn-secondary btn-block"
              style={{ marginTop: "0.75rem" }}
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>

            <button
              style={{ marginTop: "1rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}
              onClick={() => { setView("METHODS"); setError(""); }}
            >
              <ArrowLeft size={16} /> Back to Methods
            </button>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div
            role="alert"
            style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: "8px", color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
