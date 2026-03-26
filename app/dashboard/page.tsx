"use client";

export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { LayoutDashboard, BookOpen, FileCheck2, Briefcase, PieChart, Users, Zap, PlayCircle, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar onLoginClick={() => {}} />
      
      <main className="container pt-32 pb-20">
        <div className="section-header" style={{ textAlign: "left", marginBottom: "3rem" }}>
          <h1 className="text-4xl font-bold">Welcome back, <span className="cyber-green-text">{user.displayName || user.email?.split('@')[0]}</span></h1>
          <p className="text-zinc-400 mt-2">Here is your academic progress overview.</p>
        </div>

        <div className="grid-12">
            {/* Stats Overview */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 border border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-sm">Courses Active</p>
                            <h3 className="text-2xl font-bold mt-1">4</h3>
                        </div>
                        <BookOpen className="text-green-400" size={24} />
                    </div>
                </div>
                <div className="glass-card p-6 border border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-sm">Mock Tests</p>
                            <h3 className="text-2xl font-bold mt-1">12</h3>
                        </div>
                        <FileCheck2 className="text-green-400" size={24} />
                    </div>
                </div>
                <div className="glass-card p-6 border border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-sm">Attendance</p>
                            <h3 className="text-2xl font-bold mt-1">94%</h3>
                        </div>
                        <Users className="text-green-400" size={24} />
                    </div>
                </div>
                <div className="glass-card p-6 border border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-sm">Overall Rank</p>
                            <h3 className="text-2xl font-bold mt-1">#42</h3>
                        </div>
                        <Zap className="text-green-400" size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="col-span-12 md:col-span-8 space-y-6">
                <div className="glass-card p-8 min-h-[400px]">
                    <h3 className="text-xl font-bold mb-6">Recent Activities</h3>
                    <div className="space-y-4">
                        {[
                            { title: "Completed 'Limits & Derivatives' Quiz", time: "2 hours ago", status: "done" },
                            { title: "Started 'Quantum Mechanics' Lecture", time: "5 hours ago", status: "ongoing" },
                            { title: "Mock Test: Physics Board Prep", time: "Yesterday", status: "done" },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-green-400/20 transition-all">
                                {activity.status === "done" ? <CheckCircle2 className="text-green-400" /> : <Clock className="text-indigo-400" />}
                                <div className="flex-1">
                                    <h4 className="font-medium">{activity.title}</h4>
                                    <p className="text-sm text-zinc-500">{activity.time}</p>
                                </div>
                                <PlayCircle size={20} className="text-zinc-600 hover:text-green-400 cursor-pointer" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-span-12 md:col-span-4">
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6">Your Profile</h3>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full border-2 border-green-400 p-1 mb-4 overflow-hidden">
                            <img src={user.photoURL || "https://avatar.iran.liara.run/public/boy"} alt="User" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <h4 className="font-bold text-lg">{user.displayName || "Academician"}</h4>
                        <p className="text-zinc-500 text-sm">{user.email || user.phoneNumber}</p>
                        
                        <div className="w-full mt-8 pt-8 border-t border-white/10 space-y-4 text-left">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Student ID</span>
                                <span>BK-{user.uid.slice(0, 6).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Class</span>
                                <span>12th (PCB)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Member Since</span>
                                <span>{new Date(user.metadata.creationTime || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
