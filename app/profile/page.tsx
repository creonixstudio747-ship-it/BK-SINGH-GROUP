"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { User, Mail, Phone, Calendar, Shield, Save, Loader2, Home, CheckCircle2 } from "lucide-react";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { app } from "../../lib/firebase";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user, loading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName,
        updatedAt: new Date().toISOString()
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-green-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar onLoginClick={() => {}} />
      
      <main className="container pt-32 pb-20 max-w-4xl">
        <div className="section-header" style={{ textAlign: "left", marginBottom: "3rem" }}>
          <h1 className="text-4xl font-bold">Your <span className="cyber-green-text">Profile</span></h1>
          <p className="text-zinc-400 mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="glass-card p-8 text-center flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-green-400/20 p-1 mb-6 relative group">
                        <img 
                            src={user.photoURL || "https://avatar.iran.liara.run/public/boy"} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-xs font-bold">CHANGE</span>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold">{user.displayName || "Academician"}</h2>
                    <p className="text-zinc-500 text-sm mb-6">{user.email || user.phoneNumber}</p>
                    <div className="inline-block px-3 py-1 bg-green-400/10 border border-green-400/20 rounded-full text-xs font-bold text-green-400 tracking-widest uppercase">
                        Active Student
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 space-y-6">
                <div className="glass-card p-8">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-green-400 outline-none transition-colors"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 text-zinc-700">
                                    <Mail size={14} /> Email Address (Primary)
                                </label>
                                <input 
                                    type="email" 
                                    value={user.email || "N/A"} 
                                    readOnly
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 cursor-not-allowed opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input 
                                    type="text" 
                                    value={user.phoneNumber || "Not linked"} 
                                    readOnly
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 cursor-not-allowed opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={14} /> Account Security
                                </label>
                                <div className="p-4 bg-green-400/5 border border-green-400/10 rounded-xl text-sm flex items-center justify-between">
                                    <span className="text-green-400">Verified Account</span>
                                    <CheckCircle2 size={16} className="text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <p className={`text-sm ${message.includes("Error") ? "text-red-400" : "text-green-400"}`}>{message}</p>
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="btn btn-primary px-8 py-3 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <div className="glass-card p-8 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold">Account Deletion</h4>
                        <p className="text-sm text-zinc-500 mt-1">Permanently remove your data from B.K. Singh ecosystem.</p>
                    </div>
                    <button className="text-red-500 text-sm font-bold hover:underline">Delete Account</button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
