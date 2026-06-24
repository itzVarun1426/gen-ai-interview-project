import React, { useContext, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import ThemeToggle from '../../../components/ThemeToggle';
import { useAuth } from '../../auth/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { handleLogout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    selfDescription, setSelfDescription,
    jobDescription, setJobDescription,
    resumeFile, setResumeFile,
    interviewLoading,
    interviewError,
    handleGenerateReport,
    reports,
    handleFetchReports,
    handleDeleteReport
  } = useContext(interviewContext);

  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    handleFetchReports();
  }, [handleFetchReports]);

  // Calculate Readiness Score (0-100)
  const calculateReadiness = () => {
    let score = 0;
    if (jobDescription.length > 50) score += 40;
    else if (jobDescription.length > 0) score += 10;

    if (resumeFile) score += 60;
    else if (selfDescription.length > 100) score += 50;
    else if (selfDescription.length > 0) score += 10;

    return Math.min(score, 100);
  };

  const readiness = calculateReadiness();
  const strokeDashoffset = 565 - (565 * readiness) / 100;

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const onLaunch = async () => {
    if (readiness < 40) return;
    const report = await handleGenerateReport();
    if (report) {
      navigate(`/interview/select/${report._id || report.id}`);
    }
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    const success = await handleDeleteReport(reportToDelete._id || reportToDelete.id);
    setIsDeleting(false);
    if (success) {
      setReportToDelete(null);
    }
  };

  const sidebarVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-inter min-h-screen selection:bg-primary-container selection:text-primary-fixed-variant overflow-x-hidden transition-colors duration-300">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".pdf"
      />

      {/* TopNavBar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 h-16 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
            i
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview<span className="text-primary">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer flex items-center justify-center ${isSettingsOpen ? 'text-primary' : ''}`}
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <button 
                    onClick={async () => {
                      await handleLogout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 font-medium"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* SideNavBar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-8 px-4 gap-6 z-40 hidden md:flex shadow-sm"
      >
        <nav className="space-y-2">
          <motion.a whileHover={{ x: 5 }} className="flex items-center gap-3 px-3 py-3 rounded-lg text-primary bg-primary/10 dark:bg-primary/20 font-semibold" href="/dashboard">
            <span className="material-symbols-outlined text-xl">dataset</span>
            <span className="text-sm tracking-wide">Preparation Setup</span>
          </motion.a>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-24 px-6 pb-12 min-h-screen relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-12 relative z-10"
        >
          <motion.div variants={cardVariants} className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Interview Setup
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Provide details about your experience and the target role to tailor the practice session.</p>
          </motion.div>

          {interviewError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium text-center shadow-sm"
            >
              Error: {interviewError}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Card: Profile */}
            <motion.div variants={cardVariants} className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 h-full flex flex-col transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Profile</h2>
                  </div>
                  {resumeFile && (
                    <span className="text-xs text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full font-semibold">Resume Added</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upload your resume or describe your background manually.</p>
                <textarea
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 flex-1"
                  placeholder="Paste your professional summary here..."
                  rows={8}
                ></textarea>
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-4 w-full py-3 rounded-lg border font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${resumeFile ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <span className="material-symbols-outlined outline-none text-[20px]">{resumeFile ? 'task_alt' : 'upload_file'}</span>
                  {resumeFile ? resumeFile.name : 'Upload PDF Resume'}
                </motion.button>
              </div>
            </motion.div>

            {/* Center Node: AI Readiness */}
            <motion.div variants={cardVariants} className="lg:col-span-2 flex justify-center py-12 lg:py-0">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.svg
                  viewBox="0 0 192 192"
                  className="absolute w-full h-full rotate-[-90deg] overflow-visible"
                >
                  <circle cx="96" cy="96" fill="transparent" r="75" stroke="#f1f5f9" strokeWidth="8"></circle>
                  <motion.circle
                    initial={{ strokeDashoffset: 471 }}
                    animate={{ strokeDashoffset: 471 - (471 * readiness) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-primary drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    cx="96" cy="96" fill="transparent" r="75" stroke="currentColor" strokeDasharray="471" strokeWidth="8"
                    strokeLinecap="round"
                  ></motion.circle>
                </motion.svg>
                <div className="text-center z-10 flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-800 tracking-tighter">
                    {readiness}<span className="text-lg text-slate-400 ml-1">%</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Readiness</span>
                </div>
              </div>
            </motion.div>

            {/* Right Card: Job Description */}
            <motion.div variants={cardVariants} className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 h-full flex flex-col transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary/20 dark:bg-primary/10 text-primary-dim dark:text-primary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Job Description</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Provide details about the role you are preparing for.</p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 flex-1"
                  placeholder="Paste the job description or requirements here..."
                  rows={8}
                ></textarea>
                <div className="mt-4 py-3 opacity-0 flex items-center justify-center gap-2 pointer-events-none">
                  <span className="material-symbols-outlined flex">upload_file</span> Placeholder
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={cardVariants} className="flex flex-col items-center pt-8">
            <motion.button
              disabled={interviewLoading || readiness < 40}
              onClick={onLaunch}
              whileHover={!interviewLoading && readiness >= 40 ? { scale: 1.02, boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)" } : {}}
              whileTap={!interviewLoading && readiness >= 40 ? { scale: 0.98 } : {}}
              className={`group relative px-10 py-4 rounded-full transition-all ${readiness >= 40
                ? 'bg-primary text-white shadow-soft cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                }`}
            >
              <div className="flex items-center gap-3 relative z-10 font-semibold text-lg">
                <span>
                  {interviewLoading ? 'Setting up session...' : 'Start Practice Session'}
                </span>
                {!interviewLoading && readiness >= 40 && (
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                )}
                {interviewLoading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </motion.button>
            <p className="text-xs text-slate-400 mt-4">Needs at least 40% readiness score to begin.</p>
          </motion.div>

          {/* Recent Reports Section */}
          <motion.div variants={cardVariants} className="pt-12 pb-8 border-t border-slate-200 dark:border-slate-800 mt-12 w-full">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Sessions
            </h2>

            {!reports || reports.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-3 text-slate-300 dark:text-slate-700">description</span>
                <p className="font-medium text-sm">No recent interview sessions found.</p>
                <p className="text-xs mt-1">Generate your first report above to see it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, idx) => (
                  <motion.div
                    key={report._id || idx}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" }}
                    onClick={() => navigate(`/evaluation/${report._id}`)}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl p-6 cursor-pointer flex flex-col gap-4 relative overflow-hidden group transition-all"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors pointer-events-none"></div>

                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 pr-4">{report.title || "Interview Session"}</h3>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex-shrink-0 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                        <span className="font-bold text-sm text-primary">{report.matchScore || "--"}%</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5" title={`${new Date(report.createdAt).toLocaleDateString()} ${new Date(report.createdAt).toLocaleTimeString()}`}>
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View details <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </span>
                        <button
                          disabled={isDeleting}
                          title={isDeleting ? "Deleting..." : "Delete report"}

                          onClick={(e) => {
                            e.stopPropagation();
                            setReportToDelete(report);
                          }}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 cursor-pointer flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {reportToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">warning</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Report?</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">"{reportToDelete.title || "this session"}"</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full pt-2">
                  <button
                    onClick={() => setReportToDelete(null)}
                    className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="py-3 px-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-sm shadow-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
