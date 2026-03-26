"use client";

import React, { useState } from "react";
import { ArrowLeft, Book, BookOpen, Calculator, FlaskConical, Languages, Atom, Dna, FileText, History, Video, HelpCircle, Zap } from "lucide-react";

type Level = 1 | 2 | 3 | 4 | 5;

const LearningHub: React.FC = () => {
  const [level, setLevel] = useState<Level>(1);
  const [board, setBoard] = useState<"CBSE" | "BSEB">("CBSE");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSubSubject, setSelectedSubSubject] = useState<string | null>(null);

  const goLevel = (l: Level) => setLevel(l);

  const classes = ["9th", "10th", "11th", "12th"];
  const subjects = [
    { name: "Maths", icon: <Calculator /> },
    { name: "Science", icon: <FlaskConical /> },
    { name: "Hindi", icon: <Languages /> },
    { name: "English", icon: <Languages /> },
  ];

  const chapters = [
    "Number Systems",
    "Polynomials",
    "Coordinate Geometry",
    "Linear Equations",
    "Euclid's Geometry",
    "Lines and Angles",
    "Triangles",
  ];

  return (
    <section className="hub-section container" id="learningHub">
      <div className="hub-header">
        <h2 className="text-3xl font-bold">Hierarchical Mock Test & Learning Hub</h2>
        <div className="hub-board-toggle">
          <button 
            className={`board-btn ${board === "CBSE" ? "active" : ""}`} 
            onClick={() => setBoard("CBSE")}
          >
            CBSE
          </button>
          <button 
            className={`board-btn ${board === "BSEB" ? "active" : ""}`} 
            onClick={() => setBoard("BSEB")}
          >
            BSEB
          </button>
        </div>
      </div>

      <div className="hub-view-container glass-card interactive min-h-[400px] p-8">
        {level === 1 && (
          <div className="hub-panel active">
            <div className="hub-grid grid-4 class-grid">
              {classes.map((c) => (
                <div key={c} className="hub-card pb-4 cursor-pointer" onClick={() => { setSelectedClass(c); goLevel(2); }}>
                    <div className="p-8 flex flex-col items-center">
                        <Book size={40} className="mb-4 text-green-400" />
                        <h3 className="text-xl font-bold">{c}</h3>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {level === 2 && (
          <div className="hub-panel">
            <div className="hub-sub-header flex items-center justify-between mb-8">
              <button className="btn-back flex items-center gap-2" onClick={() => goLevel(1)}>
                <ArrowLeft size={18} /> Back
              </button>
              <h3 className="text-xl font-bold">{selectedClass} Subjects</h3>
            </div>
            <div className="hub-grid grid-4">
              {subjects.map((s) => (
                <div key={s.name} className="hub-card cursor-pointer" onClick={() => { setSelectedSubject(s.name); goLevel(4); }}>
                   <div className="p-8 flex flex-col items-center">
                        {s.icon}
                        <h3 className="mt-4 font-bold">{s.name}</h3>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {level === 4 && (
          <div className="hub-panel">
            <div className="hub-sub-header flex items-center justify-between mb-8">
              <button className="btn-back flex items-center gap-2" onClick={() => goLevel(2)}>
                <ArrowLeft size={18} /> Back
              </button>
              <h3 className="text-xl font-bold">{selectedSubject} Chapters</h3>
            </div>
            <div className="hub-list space-y-2">
              {chapters.map((ch, i) => (
                <div key={ch} className="hub-item p-4 glass-card-inner flex justify-between items-center hover:bg-white/5 cursor-pointer" onClick={() => goLevel(5)}>
                  <span>{i + 1}. {ch}</span>
                  <ArrowLeft style={{ transform: "rotate(180deg)" }} size={16} className="text-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        )}

        {level === 5 && (
          <div className="hub-panel">
            <div className="hub-sub-header flex items-center justify-between mb-8">
              <button className="btn-back flex items-center gap-2" onClick={() => goLevel(4)}>
                <ArrowLeft size={18} /> Back
              </button>
              <h3 className="text-xl font-bold">Resource Dashboard</h3>
            </div>
            <div className="hub-grid grid-5">
                {[
                    { name: "Notes", icon: <FileText /> },
                    { name: "PYQs", icon: <History /> },
                    { name: "Lectures", icon: <Video /> },
                    { name: "Quiz", icon: <HelpCircle /> },
                    { name: "Tips", icon: <Zap /> },
                ].map((item) => (
                    <div key={item.name} className="hub-card action-card p-6 flex flex-col items-center gap-2 cursor-pointer">
                        {item.icon}
                        <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LearningHub;
