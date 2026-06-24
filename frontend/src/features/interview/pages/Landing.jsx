import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../../components/ThemeToggle';

const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  // Animation Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const floatAnimationReverse = {
    y: [0, 15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const faqs = [
    { q: "How does the AI interview practice work?", a: "Our AI simulates a real interview environment, asking tailored questions based on your target role and providing real-time feedback on your responses using advanced natural language processing." },
    { q: "Can I practice for specific roles?", a: "Yes, you can configure the AI to focus on specific industries, roles, and experience levels (from Junior to Executive) to ensure the practice is highly relevant to your career path." },
    { q: "Is my data and privacy protected?", a: "Absolutely. We employ bank-level encryption. Your practice sessions, video feeds, and personal data are strictly confidential and never shared with third parties or employers." },
    { q: "Do I get feedback on my performance?", a: "After each session, you receive a comprehensive dashboard report detailing your technical accuracy, behavioral strengths, communication clarity, tone analysis, and actionable advice to improve." },
  ];

  return (
    <main className="relative bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-inter selection:bg-primary/20 selection:text-primary overflow-x-hidden transition-colors duration-500">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 lg:px-10 h-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
              i
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Interview<span className="text-primary">AI</span>
            </span>
          </motion.div>
          <div className="hidden md:flex gap-8 items-center bg-slate-100/50 dark:bg-slate-900/50 px-6 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50">
            {['Home', 'Core Features', 'Capabilities', 'Blog'].map((item, i) => (
              <motion.a 
                key={item} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors cursor-pointer" 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 lg:gap-6">
            <ThemeToggle />
            <a href="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary font-medium text-sm hidden sm:block transition-colors">Log in</a>
            <a href="/register" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-bold rounded-full transition-all shadow-xl hover:-translate-y-0.5">
              Get Started
            </a>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px] lg:blur-[120px]"></motion.div>
          <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] rounded-full bg-emerald-300/20 dark:bg-emerald-800/20 blur-[100px] lg:blur-[120px]"></motion.div>
          {/* Cyber Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next Gen AI Platform
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-space-grotesk text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-slate-900 dark:text-white mb-6">
              Nail Your <br className="hidden lg:block"/>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Dream Job
                <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute -bottom-2 lg:-bottom-4 left-0 w-full h-4 lg:h-6 stroke-primary" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 5" fill="transparent" strokeWidth="4" strokeLinecap="round"/></motion.svg>
              </span> <br />
              With AI.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Stop guessing what interviewers want. Practice with an elite AI coach that analyzes your responses, tone, and pacing in real-time.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2">
                Start Practicing Free <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <a href="#core-features" className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-800 dark:text-slate-200 font-bold rounded-full border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all text-center">
                Explore Features
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center z-[${5-i}]`}>
                    <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                  </div>
                ))}
              </div>
              <p>Join <span className="text-primary font-bold">10,000+</span> candidates</p>
            </motion.div>
          </motion.div>

          {/* Hero Visuals - Floating Bento UI */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="relative h-[500px] lg:h-[600px] hidden md:block w-full">
            {/* Main Video Interface */}
            <motion.div animate={floatAnimation} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[460px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  Live Session
                </div>
                <div className="w-10"></div>
              </div>
              <div className="h-64 relative bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                {/* Radar Sweep Effect */}
                <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(16,185,129,0)_0%,rgba(16,185,129,0.1)_50%,rgba(16,185,129,0)_100%)] animate-spin" style={{ animationDuration: '4s' }}></div>
                
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-900 shadow-xl flex items-center justify-center relative z-10 overflow-hidden">
                  <span className="material-symbols-outlined text-5xl text-slate-400">face</span>
                  {/* Scanning line */}
                  <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute left-0 w-full h-1 bg-primary/50 blur-[1px]"></motion.div>
                </div>
                <div className="mt-4 px-3 py-1 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-sm text-xs font-bold text-slate-700 dark:text-slate-300 backdrop-blur-sm z-10 border border-slate-200/50 dark:border-slate-700">
                  User Camera Active
                </div>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-900/50 flex justify-center gap-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">mic</span></div>
                <div className="w-12 h-12 rounded-2xl bg-red-500 shadow-lg shadow-red-500/30 flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer"><span className="material-symbols-outlined">call_end</span></div>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">videocam</span></div>
              </div>
            </motion.div>

            {/* Floating Analysis Card 1 */}
            <motion.div animate={floatAnimationReverse} className="absolute top-[15%] right-[5%] lg:-right-4 w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 dark:border-white/10 z-30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-sm">psychology</span></div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Confidence Score</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">92%</div>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1.5, delay: 1 }} className="h-full bg-gradient-to-r from-primary to-emerald-400"></motion.div>
              </div>
            </motion.div>

            {/* Floating Feedback Card 2 */}
            <motion.div animate={floatAnimation} className="absolute bottom-[15%] left-[5%] lg:-left-12 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 dark:border-white/10 z-30">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Excellent STAR format</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Your response clearly outlined the Situation, Task, Action, and Result.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section id="core-features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-black tracking-widest text-sm uppercase mb-3">The Engine</h2>
            <h3 className="font-space-grotesk text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Unfair Advantages</span>.
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Every element of our platform is designed to give you precise, actionable data to outshine the competition.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { title: 'Dynamic AI Persona', icon: 'smart_toy', desc: 'The AI adapts its personality from friendly HR to rigorous Technical Lead based on your settings.'},
              { title: 'Real-Time Telemetry', icon: 'speed', desc: 'Track pacing, filler words, and sentiment analysis instantly as you speak.'},
              { title: 'Tailored Question Bank', icon: 'database', desc: 'Millions of real questions curated for your specific industry and seniority level.'},
              { title: 'Deep Analytics Report', icon: 'insert_chart', desc: 'Exportable, highly detailed post-interview reports with actionable improvement steps.'}
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft hover:shadow-xl border border-slate-200/50 dark:border-slate-800 transition-all duration-300 overflow-hidden"
              >
                {/* Hover gradient background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white text-slate-700 dark:text-slate-300 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-primary">
                    <span className="material-symbols-outlined text-3xl">{feat.icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-space-grotesk">{feat.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Box Platform Capabilities */}
      <section id="capabilities" className="py-32 bg-slate-950 relative overflow-hidden">
        {/* Dark theme specific background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-primary font-black tracking-widest text-sm uppercase mb-2">Capabilities</h2>
            <h3 className="font-space-grotesk text-4xl md:text-5xl font-extrabold text-white leading-tight">
              A Complete Arsenal. <br className="hidden md:block"/>
              <span className="text-slate-400">Zero Excuses.</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
            {/* Large Bento Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group backdrop-blur-md">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-auto border border-white/5 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <div className="mt-8">
                  <h4 className="text-3xl font-space-grotesk font-bold text-white mb-4">Conversational Fluidity</h4>
                  <p className="text-slate-400 text-lg max-w-md">Our LLM architecture doesn't just ask static questions. It listens, interrupts, and probes deeper into your answers, just like a real hiring manager.</p>
                </div>
              </div>
            </motion.div>

            {/* Medium Tall Bento */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="md:col-span-1 lg:col-span-2 row-span-1 bg-gradient-to-r from-primary/20 to-emerald-900/40 border border-primary/30 rounded-[2rem] p-8 relative overflow-hidden group backdrop-blur-md flex flex-col justify-center">
              <h4 className="text-2xl font-space-grotesk font-bold text-white mb-2 group-hover:text-primary-container transition-colors">Resume Integration</h4>
              <p className="text-emerald-100/70">Upload your PDF. The AI reads it instantly and grills you on that specific "30% performance increase" you claimed.</p>
            </motion.div>

            {/* Small Bentos */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-1 lg:col-span-1 row-span-1 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md hover:bg-slate-800/50 transition-colors flex flex-col justify-between">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">code</span>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Technical Coding</h4>
                <p className="text-sm text-slate-500">Live whiteboard integration coming soon.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="md:col-span-2 lg:col-span-1 row-span-1 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md hover:bg-slate-800/50 transition-colors flex flex-col justify-between">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">history</span>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Session History</h4>
                <p className="text-sm text-slate-500">Review your past recordings and track growth.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog / Insights */}
      <section id="blog" className="py-24 bg-white dark:bg-slate-950 transition-colors relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-primary font-black tracking-widest text-sm uppercase mb-2">Knowledge Base</h2>
              <h3 className="font-space-grotesk text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Latest Strategies
              </h3>
            </div>
            <button className="text-primary font-bold hover:text-primary-dim flex items-center gap-1 group">
              View All Articles <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Main Article */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="group cursor-pointer">
              <div className="relative h-[350px] lg:h-[450px] rounded-[2rem] overflow-hidden mb-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                {/* Abstract placeholder visual */}
                <div className="absolute inset-0 bg-primary/10 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.3)_0,transparent_70%)]"></div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="flex items-center gap-3 text-xs font-bold text-primary mb-3 uppercase tracking-wider bg-white/10 backdrop-blur-md w-max px-3 py-1 rounded-full">
                    <span>Interviewing</span>
                    <span className="w-1 h-1 rounded-full bg-white/50"></span>
                    <span className="text-white/80">5 min read</span>
                  </div>
                  <h4 className="text-2xl lg:text-3xl font-space-grotesk font-bold text-white mb-2 leading-snug">Mastering AI-Powered Mock Interviews for Real Results</h4>
                </div>
              </div>
            </motion.div>
            
            {/* List of articles */}
            <div className="flex flex-col gap-4 justify-center">
              {[
                {cat: 'Career Path', title: 'Generative AI in Modern Recruitment: What Changed?', time: '4 min', icon: 'auto_awesome'},
                {cat: 'Technology', title: 'Why Companies Still Look for Soft Skills in Tech', time: '6 min', icon: 'groups'},
                {cat: 'Preparation', title: 'Answering the "What is Your Weakness" Prompt', time: '3 min', icon: 'psychology_alt'}
              ].map((blog, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-center group cursor-pointer p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors group-hover:scale-110 duration-300">{blog.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                      <span>{blog.cat}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="text-slate-500 dark:text-slate-400">{blog.time} read</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">{blog.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/20 relative z-10 border-y border-slate-200 dark:border-slate-800/50 transition-colors">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-black tracking-widest text-sm uppercase mb-2">FAQ</h2>
            <h3 className="font-space-grotesk text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Clear Answers.
            </h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === i ? 'border-primary shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'border-slate-200 dark:border-slate-800'}`}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg transition-colors ${activeFaq === i ? 'text-primary' : 'text-slate-800 dark:text-slate-200'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${activeFaq === i ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/50 mt-2 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Module */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900 dark:bg-[#020e0a] rounded-[3rem] px-8 py-24 text-center relative overflow-hidden border border-slate-800 dark:border-white/10 shadow-2xl">
          {/* Animated Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] h-[300px] bg-primary/30 dark:bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-space-grotesk text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Unlock Your Dream Role. <br className="hidden md:block"/>
              <span className="text-primary">Start Practicing Today.</span>
            </h2>
            <p className="text-slate-300 dark:text-emerald-100/70 text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of candidates who transformed their interview anxiety into unshakeable confidence.
            </p>
            <a href="/register" className="inline-flex items-center gap-2 px-12 py-5 bg-primary text-white font-bold text-lg rounded-full hover:bg-primary-dim transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:-translate-y-1">
              Create Free Account
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact-us" className="bg-slate-950 pt-20 pb-10 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <span className="text-3xl font-black tracking-tight text-white font-space-grotesk mb-6 block">
                Interview<span className="text-primary">AI</span>
              </span>
              <p className="text-slate-400 text-sm mb-8 max-w-sm leading-relaxed">Revolutionizing interview preparation through artificial intelligence. Practice anytime, anywhere, and get real-time feedback to land your dream job.</p>
              <div className="flex gap-4">
                {['link', 'mail', 'share'].map((icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-space-grotesk">Platform</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Core Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Capabilities</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-space-grotesk">Resources</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Knowledge Base</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Interview Guides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Career Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-space-grotesk">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2024 InterviewAI. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Status</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
};

export default Landing;
