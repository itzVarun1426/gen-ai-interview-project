import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../../components/ThemeToggle';

const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const faqs = [
    { q: "How does the AI interview practice work?", a: "Our AI simulates a real interview environment, asking tailored questions based on your target role and providing real-time feedback on your responses." },
    { q: "Can I practice for specific roles?", a: "Yes, you can configure the AI to focus on specific industries, roles, and experience levels to ensure the practice is highly relevant." },
    { q: "Is my data and privacy protected?", a: "Absolutely. We do not share your practice sessions or personal data with any third parties." },
    { q: "Do I get feedback on my performance?", a: "After each session, you receive a comprehensive report detailing your strengths, weaknesses, and actionable advice to improve." },
  ];

  return (
    <main className="relative bg-white dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-inter selection:bg-primary-container selection:text-primary-fixed-variant overflow-x-hidden transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-10 h-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              i
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Interview<span className="text-primary">AI</span>
            </span>
          </motion.div>
          <div className="hidden md:flex gap-8 items-center">
            {['Home', 'Core Features', 'Learn More', 'Blog', 'Contact Us'].map((item, i) => (
              <motion.a 
                key={item} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors cursor-pointer" 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
            <ThemeToggle />
            <a href="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary font-medium text-sm hidden md:block">Log in</a>
            <a href="/register" className="px-6 py-2.5 bg-primary hover:bg-primary-dim text-white text-sm font-semibold rounded-full transition-all shadow-soft hover:shadow-glow">
              Get Started
            </a>
          </motion.div>
        </div>
      </nav>

      <div className="relative pt-24">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-primary/5 blur-[100px]"></div>
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[80px]"></div>
          {/* Subtle Grid Pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        {/* Hero Section */}
        <section id="home" className="relative min-h-[85vh] flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-12 gap-12">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 space-y-8 z-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-dim text-xs font-bold uppercase tracking-wider">
              <span>Next Generation AI</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-space-grotesk text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Ace Your <br />
              <span className="inline-flex items-center gap-4">
                <span className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">arrow_forward</span></span>
                Next Interview
              </span><br />
              with <span className="text-primary relative inline-block">AI-Powered <svg className="absolute -bottom-2 aspect-[3/1] w-full" viewBox="0 0 100 20"><path d="M0 10 Q 50 20 100 10" fill="transparent" stroke="#10b981" strokeWidth="4" strokeLinecap="round"/></svg></span> Practice
            </motion.h1>
            <motion.p variants={itemVariants} className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Your first impression is everything. Practice with our upcoming AI coach to perfect your interview skills, refine your pitch, and build unshakable confidence.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <a href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all text-center">
                Start for free
              </a>
              <a href="#core-features" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center">
                View features
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1 w-full relative z-10 flex justify-center lg:justify-end">
            {/* Abstract Video Mockup UI for AI interview */}
            <div className="relative w-[340px] md:w-[480px] h-[400px] md:h-[500px] bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
               <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 justify-between bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-xs font-medium text-slate-400">AI Practice Session</div>
                  <div className="w-16"></div>
               </div>
               <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {/* Avatar / Camera Placeholder */}
                  <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center transition-colors">
                     <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500">videocam</span>
                  </div>
                  {/* Floating tags */}
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 right-10 bg-white p-2 rounded-lg shadow-sm text-xs font-bold text-primary flex items-center gap-1 border border-slate-100">
                     <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Analyzing Tone
                  </motion.div>
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-10 left-10 bg-white p-2 rounded-lg shadow-sm text-xs font-bold text-blue-500 flex items-center gap-1 border border-slate-100">
                     <span className="material-symbols-outlined text-[14px]">psychology</span> Cognitive Load
                  </motion.div>
               </div>
               <div className="h-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 cursor-not-allowed"><span className="material-symbols-outlined">mic</span></div>
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md cursor-not-allowed"><span className="material-symbols-outlined">call_end</span></div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 cursor-not-allowed"><span className="material-symbols-outlined">videocam</span></div>
               </div>
            </div>
            
            {/* Decoration Elements */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined">insight</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Insight Engine</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Preparing architecture...</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid Section */}
        <section id="core-features" className="py-24 bg-slate-50 dark:bg-slate-900/10 border-y border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:w-1/2">
               <h2 className="text-primary font-bold tracking-wider text-sm uppercase mb-2">Core Features</h2>
               <h3 className="font-space-grotesk text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Simple Process. <br/>Powerful Results.
               </h3>
               <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">We are structuring the core architecture to bring you an unparalleled interview practice experience. Soon, you will be able to harness these capabilities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: 'AI-Powered Practice', icon: 'smart_toy', desc: 'Mock interviews that adapt to your target industry and role level.'},
                 { title: 'Actionable Insights', icon: 'analytics', desc: 'Detailed, real-time feedback on your answers, clarity, and tone.'},
                 { title: 'Refine Your Pitch', icon: 'record_voice_over', desc: 'Specific recommendations to improve your confidence and delivery.'},
                 { title: 'Comprehensive Reports', icon: 'summarize', desc: 'In-depth post-session analysis outlining your core strengths.'}
               ].map((feat, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300"
                  >
                     <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-3xl">{feat.icon}</span>
                     </div>
                     <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feat.title}</h4>
                     <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                  </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Dark Smart Tools Grid */}
        <section id="learn-more" className="py-32 bg-[#0a251c] relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.4)_0,transparent_50%)]"></div>
           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                 <h2 className="text-primary-dim font-bold tracking-wider text-sm uppercase mb-2">Platform Capabilities</h2>
                 <h3 className="font-space-grotesk text-4xl md:text-5xl font-extrabold text-white leading-tight">
                    Smart Tools for AI-Powered <br/>Interview Practice
                 </h3>
                 <p className="mt-4 text-emerald-100/70 text-lg max-w-2xl mx-auto">Our future tool suite will be heavily integrated with conversational AI models to help you succeed at every step of your career journey.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                 {/* Large Card */}
                 <div className="md:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between min-h-[300px]">
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6"><span className="material-symbols-outlined">model_training</span></div>
                    <div>
                       <h4 className="text-2xl font-bold text-white mb-2">Simulated Environments</h4>
                       <p className="text-emerald-100/70 max-w-md">Train your reflexes with timed scenarios, stressful questioning patterns, and technical behavioral questions tailored for your dream job.</p>
                    </div>
                 </div>
                 {/* Medium Card */}
                 <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors min-h-[300px]">
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6"><span className="material-symbols-outlined">query_stats</span></div>
                    <h4 className="text-xl font-bold text-white mb-2">Real-Time Adjustments</h4>
                    <p className="text-emerald-100/70 text-sm">Dynamic AI pivots the interview direction based on your previous answers.</p>
                 </div>
                 
                 {/* Small Cards */}
                 <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <h4 className="text-lg font-bold text-white mb-2">Question Bank</h4>
                    <p className="text-emerald-100/70 text-sm">Thousands of real-world questions sourced from top companies.</p>
                 </div>
                 <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <h4 className="text-lg font-bold text-white mb-2">The Right Profile</h4>
                    <p className="text-emerald-100/70 text-sm">Resume parsing integrates directly into the session parameters.</p>
                 </div>
                 <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <h4 className="text-lg font-bold text-white mb-2">Personal Coach</h4>
                    <p className="text-emerald-100/70 text-sm">Track your progress over weeks and establish a learning roadmap.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Blog / Insights */}
        <section id="blog" className="py-24 bg-white dark:bg-slate-950 transition-colors">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-primary font-bold tracking-wider text-sm uppercase mb-2">Read Latest</h2>
                 <h3 className="font-space-grotesk text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    Dive Into Our Top Career Insights
                 </h3>
                 <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Expert advice, industry trends, and deep dives into the modern recruitment landscape.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Main Article */}
                 <div className="group cursor-pointer">
                    <div className="relative h-[400px] rounded-3xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
                       {/* Placeholder for an Image */}
                       <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"></div>
                       <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 relative z-10 group-hover:scale-110 transition-transform duration-500">article</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-primary mb-3">
                       <span>Interviewing</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                       <span className="text-slate-500">5 min read</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">Mastering AI-Powered Mock Interviews for Real Results</h4>
                    <p className="text-slate-600 dark:text-slate-400">Discover everything you need to know about setting up a successful simulation environment yielding the best results.</p>
                 </div>
                 
                 {/* List of articles */}
                 <div className="flex flex-col gap-6">
                    {[
                      {cat: 'Career Path', title: 'Generative AI in Modern Recruitment', time: '4 min'},
                      {cat: 'Technology', title: 'Why Companies Look for Soft Skills in Tech', time: '6 min'},
                      {cat: 'Preparation', title: 'Answering the "What is Your Weakness" Prompt', time: '3 min'}
                    ].map((blog, i) => (
                       <div key={i} className="flex gap-6 items-center group cursor-pointer p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                          <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                             <div className="absolute inset-0 bg-slate-200"></div>
                             <span className="material-symbols-outlined text-3xl text-slate-300 relative z-10 group-hover:scale-110 transition-transform duration-500">image</span>
                          </div>
                          <div>
                             <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                                <span>{blog.cat}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-slate-500">{blog.time} read</span>
                             </div>
                             <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">{blog.title}</h4>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* FAQs */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/10 transition-colors">
           <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-primary font-bold tracking-wider text-sm uppercase mb-2">FAQ</h2>
                 <h3 className="font-space-grotesk text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Everything You Need to Know
                 </h3>
              </div>
              <div className="space-y-4">
                 {faqs.map((faq, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
                       <button 
                         onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                         className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                       >
                          <span className={`font-bold ${activeFaq === i ? 'text-primary' : 'text-slate-800 dark:text-slate-100'}`}>{faq.q}</span>
                          <span className={`material-symbols-outlined text-slate-400 dark:text-slate-500 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-primary' : ''}`}>
                             expand_more
                          </span>
                       </button>
                       <AnimatePresence>
                          {activeFaq === i && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="overflow-hidden"
                             >
                                <div className="px-6 pb-5 pt-0 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-800 mt-2">
                                   {faq.a}
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Final CTA Module */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
           <div className="bg-[#041610] rounded-[40px] px-8 py-20 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-primary/20 blur-[100px] rounded-[100%] pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                 <h2 className="font-space-grotesk text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                    Unlock Your Dream Role – One Session Away
                 </h2>
                 <p className="text-emerald-100/80 text-lg mb-10">
                    Join the waitlist to be among the first to experience our cutting-edge AI interview platform when it launches.
                 </p>
                 <a href="/register" className="inline-block px-10 py-5 bg-primary text-white font-bold rounded-full hover:bg-primary-dim transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                    Get Access Now
                 </a>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer id="contact-us" className="bg-[#020e0a] pt-20 pb-10 border-t border-white/10">
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                 <div className="md:col-span-1">
                    <span className="text-2xl font-bold tracking-tight text-white font-space-grotesk mb-6 block">
                       Interview<span className="text-primary">AI</span>
                    </span>
                    <p className="text-emerald-100/50 text-sm mb-6">Revolutionizing interview preparation through artificial intelligence directly in your browser.</p>
                 </div>
                 <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-3 text-emerald-100/60 text-sm">
                       <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-white font-bold mb-4">Product</h4>
                    <ul className="space-y-3 text-emerald-100/60 text-sm">
                       <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Waitlist</a></li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-3 text-emerald-100/60 text-sm">
                       <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                    </ul>
                 </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                 <p className="text-emerald-100/40 text-xs">© 2024 InterviewAI. All rights reserved.</p>
                 <div className="flex gap-4">
                    {/* Social Plugs */}
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-100/60 hover:bg-primary/20 hover:text-primary cursor-pointer transition-all"><span className="material-symbols-outlined text-sm">link</span></div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-100/60 hover:bg-primary/20 hover:text-primary cursor-pointer transition-all"><span className="material-symbols-outlined text-sm">mail</span></div>
                 </div>
              </div>
           </div>
        </footer>

      </div>
    </main>
  );
};

export default Landing;

