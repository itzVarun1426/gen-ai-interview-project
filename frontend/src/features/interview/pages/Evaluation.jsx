import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import { getInterviewReportById } from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';

const Evaluation = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { report, setReport, interviewLoading, setInterviewLoading } = useContext(interviewContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      // Always fetch to ensure we get the latest user answers after an interview
      if (typeof setInterviewLoading === 'function') setInterviewLoading(true);

      try {
        const data = await getInterviewReportById(interviewId);
        if (data?.interviewReport) {
          setReport(data.interviewReport);
        }
      } catch (err) {
        console.error("Failed to fetch report:", err);
      } finally {
        if (typeof setInterviewLoading === 'function') setInterviewLoading(false);
      }
    };

    if (interviewId) fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // Clean up if a print is pending
  useEffect(() => {
    if (isPrinting) {
      const timer = setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 500); // give the DOM time to render all tabs before the print dialog opens
      return () => clearTimeout(timer);
    }
  }, [isPrinting]);

  if (interviewLoading && !report) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4 transition-colors">
        <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 overflow-hidden relative rounded-full">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary"
          />
        </div>
        <p className="text-primary font-inter font-medium text-xs tracking-wider uppercase animate-pulse">Generating Report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-6 print:hidden transition-colors">
        <span className="material-symbols-outlined text-red-500 text-6xl opacity-40">error</span>
        <p className="text-slate-500 dark:text-slate-400 font-inter text-sm font-medium">Unable to load the evaluation report.</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all text-sm rounded-lg font-semibold shadow-sm">Return to Dashboard</button>
      </div>
    );
  }

  const { matchScore, title, skillsGaps, technicalQuestions, behavioralQuestions, preparationPlan } = report;
  const scoreToDisplay = typeof matchScore === 'number' ? matchScore : 70; // Fallback just in case

  const navItems = [
    { id: 'overview', label: 'Summary', icon: 'analytics' },
    { id: 'technical', label: 'Technical', icon: 'code' },
    { id: 'behavioral', label: 'Behavioral', icon: 'psychology' },
    { id: 'skills', label: 'Gaps', icon: 'error_outline' },
    { id: 'roadmap', label: 'Roadmap', icon: 'auto_stories' },
  ];

  const handlePrint = () => {
    setIsPrinting(true);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-inter min-h-screen flex flex-col items-center overflow-x-hidden relative transition-colors duration-300">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.1),transparent_70%)]" />

      {/* Top Bar - Minimal Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-7xl px-8 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden shadow-sm transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors" onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Interview Report</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px] md:max-w-xs">{title || "Evaluation Results"}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            disabled={isPrinting}
            onClick={handlePrint}
            className="flex items-center gap-2 h-10 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary rounded-lg transition-all text-sm font-semibold shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span className="hidden sm:inline">{isPrinting ? 'Preparing PDF...' : 'Export PDF'}</span>
          </button>
        </div>
      </motion.header>

      {/* Main Analysis Stage */}
      <main className="w-full max-w-5xl px-6 pt-8 pb-32 print:p-0 print:pt-0">
        <div className={isPrinting ? 'space-y-16 print:space-y-10' : ''}>
          <AnimatePresence mode={isPrinting ? undefined : "wait"}>
            {(isPrinting || activeTab === 'overview') && (
              <motion.section
                key="overview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isPrinting ? undefined : { opacity: 0, scale: 1.02 }}
                className={`flex flex-col items-center py-12 ${isPrinting ? 'print:break-after-page' : ''}`}
              >
                <div className="relative w-72 h-72 flex items-center justify-center mb-10">
                  <motion.svg
                    viewBox="0 0 288 288"
                    className="w-full h-full -rotate-90 transform drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] dark:drop-shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-visible"
                  >
                    <circle className="text-slate-200 dark:text-slate-800" cx="144" cy="144" fill="transparent" r="110" stroke="currentColor" strokeWidth="8"></circle>
                    <motion.circle
                      initial={{ strokeDashoffset: 691.15 }}
                      animate={{ strokeDashoffset: 691.15 - (691.15 * (scoreToDisplay)) / 100 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-primary transition-all duration-1000"
                      cx="144" cy="144" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691.15" strokeWidth="8" strokeLinecap="round"
                    ></motion.circle>
                  </motion.svg>

                  <div className="absolute flex flex-col items-center">
                    <motion.div
                      key={scoreToDisplay}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-7xl font-bold tracking-tight text-slate-800 dark:text-white flex items-baseline"
                    >
                      {scoreToDisplay}<span className="text-2xl text-slate-400 ml-1">%</span>
                    </motion.div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-2">Overall Match Score</span>
                  </div>
                </div>

                <div className="text-center max-w-2xl space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{title || "Evaluation Results"}</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                    Based on your provided background and the job requirements, here is your readiness assessment.
                    Review the specific technical and behavioral feedback below to identify areas of improvement and prepare effectively.
                  </p>
                </div>
              </motion.section>
            )}

            {(isPrinting || activeTab === 'technical' || activeTab === 'behavioral') && (
              <React.Fragment key="questions-group">
                {(isPrinting || activeTab === 'technical') && (
                  <motion.section
                    key="technical"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={isPrinting ? undefined : { opacity: 0, x: -20 }}
                    className={`space-y-10 ${isPrinting ? 'print:break-inside-avoid print:mt-10' : ''}`}
                  >
                    <div className="flex flex-col gap-1 border-l-4 border-primary dark:border-primary pl-5">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Technical Questions</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Practice standard domain-specific questions</p>
                    </div>

                    <div className="grid gap-6">
                      {technicalQuestions?.map((q, i) => (
                        <div
                          key={`tech-${i}`}
                          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 print:border-slate-300 print:shadow-none print:break-inside-avoid transition-colors"
                        >
                          <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-start gap-4">
                              <span className="text-xl font-bold text-primary shrink-0 pt-0.5">Q{i + 1}.</span>
                              <h3 className="text-[17px] font-bold text-slate-400 leading-snug">{q.question}</h3>
                            </div>

                            <div className="grid gap-5">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 print:bg-black"></span>
                                  <span className="text-xs font-bold text-slate-400 print:text-black uppercase tracking-wider">Interviewer Intent</span>
                                </div>
                                <p className="text-sm text-slate-400 print:text-black leading-relaxed pl-3.5 border-l-2 border-slate-100 print:border-slate-300">
                                  {q.intention}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary print:bg-black"></span>
                                  <span className="text-xs font-bold text-primary print:text-black uppercase tracking-wider">Suggested Answer Strategy</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 print:bg-transparent p-4 rounded-xl border border-slate-100 dark:border-slate-800 print:border-slate-300">
                                  <p className="text-[14px] text-slate-700 dark:text-slate-300 print:text-black leading-relaxed font-medium">{q.answer}</p>
                                </div>
                              </div>

                              {/* Performance Feedback */}
                              {q.userAnswer && (
                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                  <div className="lg:col-span-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Answer</span>
                                      <div className="px-2 py-1 bg-primary/10 rounded text-primary text-[10px] font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">star</span>
                                        Score: {q.feedback?.score || 0}%
                                      </div>
                                    </div>
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                                      "{q.userAnswer}"
                                    </p>
                                  </div>

                                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        Improvements
                                      </span>
                                      <ul className="space-y-2">
                                        {q.feedback?.improvements?.map((imp, idx) => (
                                          <li key={idx} className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                            <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                            {imp}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="space-y-3">
                                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                        Drawbacks
                                      </span>
                                      <ul className="space-y-2">
                                        {q.feedback?.drawbacks?.map((drw, idx) => (
                                          <li key={idx} className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                            <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                            {drw}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {(isPrinting || activeTab === 'behavioral') && (
                  <motion.section
                    key="behavioral"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={isPrinting ? undefined : { opacity: 0, x: -20 }}
                    className={`space-y-10 ${isPrinting ? 'print:break-inside-avoid print:mt-10' : ''}`}
                  >
                    <div className="flex flex-col gap-1 border-l-4 border-primary dark:border-primary pl-5">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Behavioral Questions</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Practice standard scenario-based questions</p>
                    </div>

                    <div className="grid gap-6">
                      {behavioralQuestions?.map((q, i) => (
                        <div
                          key={`beh-${i}`}
                          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 print:border-slate-300 print:shadow-none print:break-inside-avoid transition-colors"
                        >
                          <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-start gap-4">
                              <span className="text-xl font-bold text-primary shrink-0 pt-0.5">Q{i + 1}.</span>
                              <h3 className="text-[17px] font-bold text-slate-400 leading-snug">{q.question}</h3>
                            </div>

                            <div className="grid gap-5">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 print:bg-black"></span>
                                  <span className="text-xs font-bold text-slate-400 print:text-black uppercase tracking-wider">Interviewer Intent</span>
                                </div>
                                <p className="text-sm text-slate-600 print:text-black leading-relaxed pl-3.5 border-l-2 border-slate-100 print:border-slate-300">
                                  {q.intention}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary print:bg-black"></span>
                                  <span className="text-xs font-bold text-primary print:text-black uppercase tracking-wider">Suggested Answer Strategy</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 print:bg-transparent p-4 rounded-xl border border-slate-100 dark:border-slate-800 print:border-slate-300">
                                  <p className="text-[14px] text-slate-700 dark:text-slate-300 print:text-black leading-relaxed font-medium">{q.answer}</p>
                                </div>
                              </div>

                              {/* Performance Feedback */}
                              {q.userAnswer && (
                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                  <div className="lg:col-span-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Answer</span>
                                      <div className="px-2 py-1 bg-primary/10 rounded text-primary text-[10px] font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">star</span>
                                        Score: {q.feedback?.score || 0}%
                                      </div>
                                    </div>
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                                      "{q.userAnswer}"
                                    </p>
                                  </div>

                                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        Improvements
                                      </span>
                                      <ul className="space-y-2">
                                        {q.feedback?.improvements?.map((imp, idx) => (
                                          <li key={idx} className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                            <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                            {imp}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="space-y-3">
                                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                        Drawbacks
                                      </span>
                                      <ul className="space-y-2">
                                        {q.feedback?.drawbacks?.map((drw, idx) => (
                                          <li key={idx} className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                            <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                            {drw}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </React.Fragment>
            )}

            {(isPrinting || activeTab === 'skills') && (
              <motion.section
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isPrinting ? undefined : { opacity: 0, y: -20 }}
                className={`space-y-10 ${isPrinting ? 'print:break-inside-avoid print:mt-12' : ''}`}
              >
                <div className="flex flex-col gap-1 border-l-4 border-red-500 pl-5">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Gaps</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Areas requiring additional study</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {skillsGaps?.map((gap, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6 relative group print:break-inside-avoid print:border-slate-300 print:shadow-none transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Missing Skill</span>
                        <h4 className="text-[17px] font-bold text-slate-900 dark:text-white">{gap.skill}</h4>
                      </div>
                      <div className={`mt-auto px-3 py-1.5 rounded-lg border text-xs font-bold w-fit flex items-center gap-2 print:bg-transparent ${gap.severity === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30 print:border-red-500' :
                        gap.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 print:border-amber-500' :
                          'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30 print:border-green-500'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full print:bg-current ${gap.severity === 'high' ? 'bg-red-500' : gap.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                          }`} />
                        Priority: {gap.severity}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {(isPrinting || activeTab === 'roadmap') && (
              <motion.section
                key="roadmap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isPrinting ? undefined : { opacity: 0, y: -20 }}
                className={`space-y-10 pb-20 print:pb-0 ${isPrinting ? 'print:break-inside-avoid print:mt-12' : ''}`}
              >
                <div className="flex flex-col gap-1 border-l-4 border-primary pl-5">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Preparation Plan</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Step-by-step learning roadmap</p>
                </div>

                <div className="space-y-6 relative before:absolute before:left-[19px] md:before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800 print:before:bg-slate-300">
                  {preparationPlan?.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={isPrinting ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      animate={isPrinting ? { opacity: 1, x: 0 } : undefined}
                      whileInView={isPrinting ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="relative pl-14 md:pl-20 group print:break-inside-avoid"
                    >
                      <div className="absolute left-1 md:left-3 top-2 w-8 h-8 rounded-full bg-white border-2 border-primary print:border-slate-800 print:text-black flex items-center justify-center z-10 transition-all font-bold text-xs text-primary shadow-sm group-hover:bg-primary group-hover:text-white">
                        {step.day}
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 print:border-slate-300 shadow-sm transition-all hover:border-primary/30">
                        <div className="mb-6">
                          <span className="text-xs font-bold text-primary print:text-black uppercase tracking-wider mb-1 block">Phase {step.day} Objective</span>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{step.focused_topic}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.task?.map((task, ti) => (
                            <div key={ti} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all">
                              <span className="material-symbols-outlined text-primary print:text-black text-[18px] shrink-0 pt-0.5">check_circle</span>
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{task}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Navigation Dock */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center gap-1 shadow-lg print:hidden transition-colors"
      >
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex items-center justify-center sm:justify-start gap-2 h-11 px-4 sm:px-5 rounded-full transition-all text-sm font-semibold ${activeTab === item.id
              ? 'text-white bg-primary'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <span className={`material-symbols-outlined text-[20px]`}>{item.icon}</span>
            <span className={`hidden sm:block`}>{item.label}</span>
          </button>
        ))}
      </motion.nav>
    </div>
  );
};

export default Evaluation;
