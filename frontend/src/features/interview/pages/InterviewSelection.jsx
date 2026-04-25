import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router';
import { 
  Play, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  UserCircle2, 
  Settings2,
  ChevronRight
} from 'lucide-react';

const InterviewSelection = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('interview');

  const options = [
    {
      id: 'interview',
      title: 'Interactive Interview',
      description: 'Engage in a live interactive session with our AI interviewer. Real-time transcription and per-question feedback.',
      icon: Play,
      color: 'from-primary to-emerald-600',
      action: () => navigate(`/interview/setup/${interviewId}`)
    },
    {
      id: 'report',
      title: 'Textual Report',
      description: 'Skip the live session and view your detailed readiness report, roadmap, and skills gap analysis immediately.',
      icon: FileText,
      color: 'from-emerald-400 to-emerald-500',
      action: () => navigate(`/evaluation/${interviewId}`)
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-inter selection:bg-primary/20 selection:text-primary">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Left Sidebar Selection */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800 p-8 flex flex-col z-10"
      >
        <div className="mb-12">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            IntervAI Hub
          </h1>
          <p className="text-slate-500 text-sm mt-2">Choose your preparation path</p>
        </div>

        <nav className="flex-1 space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full group relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedOption === option.id 
                ? 'bg-primary/10 border-primary/30' 
                : 'hover:bg-slate-800/50 border-transparent'
              } border`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                selectedOption === option.id ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <option.icon size={20} />
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${
                  selectedOption === option.id ? 'text-primary' : 'text-slate-300'
                }`}>
                  {option.title}
                </p>
              </div>
              <ChevronRight 
                size={16} 
                className={`transition-transform duration-300 ${
                  selectedOption === option.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                } text-primary`} 
              />
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-700">
              <UserCircle2 size={24} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">Target Role</p>
              <p className="text-[10px] text-slate-500 truncate w-40">Software developer intern</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex items-center justify-center p-12 z-10">
        <AnimatePresence mode="wait">
          {options.map((option) => option.id === selectedOption && (
            <motion.div
              key={option.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-2xl w-full"
            >
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-2xl mb-8 ring-4 ring-slate-950`}>
                <option.icon size={40} className="text-white" />
              </div>

              <h2 className="text-5xl font-bold mb-6 tracking-tight">
                Ready to level up your <span className={`bg-gradient-to-r ${option.color} bg-clip-text text-transparent`}>preparation?</span>
              </h2>
              
              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                {option.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Advantage</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {option.id === 'interview' 
                      ? 'Simulates actual stress and develops muscle memory for technical explanations.' 
                      : 'Overview of all technical gaps and prioritized learning path for the week.'}
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl group hover:border-emerald-400/50 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Settings2 size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Method</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {option.id === 'interview' 
                      ? 'Uses Gemini-Flash for low latency evaluation and real-time STT.' 
                      : 'Comprehensive analysis of resume vs job description requirements.'}
                  </p>
                </div>
              </div>

              <button
                onClick={option.action}
                className={`group relative flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r ${option.color} text-white font-bold text-lg shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>{option.id === 'interview' ? 'Launch Interview Session' : 'View Full Report Now'}</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
              
              <p className="text-center text-slate-500 text-sm mt-6">
                You can always switch between modes later from the dashboard
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InterviewSelection;
