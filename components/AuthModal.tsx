"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, Phone, ArrowLeft, ArrowRight, Hexagon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthState = "METHODS" | "EMAIL" | "PHONE" | "VERIFY";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginWithGoogle, setupRecaptcha, sendOtp } = useAuth();
  const [state, setState] = useState<AuthState>("METHODS");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen && state === "PHONE") {
      setupRecaptcha("recaptcha-container");
    }
  }, [isOpen, state]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (isSignUp) {
        await signup(email, password, email.split("@")[0]);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await sendOtp(phone);
      setConfirmationResult(res);
      setState("VERIFY");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await confirmationResult.confirm(otp);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay active" onClick={onClose}>
      <div className="auth-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="auth-modal-header">
          <Hexagon className="logo-icon cyber-green" size={40} style={{ margin: "0 auto 1rem" }} />
          <h2>{state === "METHODS" ? "Access Portal" : state === "VERIFY" ? "Verify OTP" : isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p>{state === "METHODS" ? "Select your preferred authentication method." : ""}</p>
        </div>

        {state === "METHODS" && (
          <div className="auth-state active">
            <button className="auth-btn" onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
              Continue with Google
            </button>
            <div className="auth-divider"><span>OR</span></div>
            <button className="auth-btn" onClick={() => setState("PHONE")}>
              <Phone size={20} /> Login with Phone
            </button>
            <button className="auth-btn" onClick={() => setState("EMAIL")}>
              <Mail size={20} /> Login with Email
            </button>
          </div>
        )}

        {state === "EMAIL" && (
          <div className="auth-state">
            <form onSubmit={handleEmailAuth}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  required 
                />
              </div>
              <div className="input-group" style={{ marginTop: "1rem" }}>
                <label>Password</label>
                <input 
                  type="password" 
                  className="auth-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "1.5rem" }} disabled={loading}>
                {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"} <ArrowRight size={18} />
              </button>
            </form>
            <button className="btn btn-secondary btn-block" style={{ marginTop: "1rem" }} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
            <button className="btn-back" style={{ marginTop: "1rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={() => setState("METHODS")}>
              <ArrowLeft size={16} /> Back to Methods
            </button>
          </div>
        )}

        {state === "PHONE" && (
          <div className="auth-state">
            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <label>Phone Number (India)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                   <span style={{ background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}>+91</span>
                   <input 
                    type="tel" 
                    className="auth-input" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="9876543210" 
                    required 
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div id="recaptcha-container"></div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "1.5rem" }} disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"} <ArrowRight size={18} />
              </button>
            </form>
            <button className="btn-back" style={{ marginTop: "1rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={() => setState("METHODS")}>
              <ArrowLeft size={16} /> Back to Methods
            </button>
          </div>
        )}

        {state === "VERIFY" && (
          <div className="auth-state">
            <form onSubmit={handleVerifyOtp}>
              <div className="input-group">
                <label>Verification Code (6-digit)</label>
                <input 
                  type="text" 
                  className="auth-input otp-input" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="000000" 
                  maxLength={6} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "1.5rem" }} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>
            <button className="btn-back" style={{ marginTop: "1rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={() => setState("PHONE")}>
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        )}

        {error && (
          <div className="auth-error-box" style={{ display: "block", marginTop: "1rem", color: "#ff4444", fontSize: "0.85rem", textAlign: "center" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
