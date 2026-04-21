import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import { getInterviewReportById } from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';

const InterviewSetup = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, setReport } = useContext(interviewContext);

    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    // Fetch report if not available
    useEffect(() => {
        const fetchReport = async () => {
            if (report && (report._id === interviewId || report.id === interviewId)) return;
            try {
                const data = await getInterviewReportById(interviewId);
                if (data?.interviewReport) {
                    setReport(data.interviewReport);
                }
            } catch (err) {
                console.error("Failed to fetch report:", err);
            }
        };
        fetchReport();
    }, [interviewId, report, setReport]);

    // Media permissions
    const startHardware = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720 }, 
                audio: true 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setPermission(true);
            setupAudioAnalysis(mediaStream);
        } catch (err) {
            console.error("Permission error:", err);
            alert("Please allow camera and microphone access to continue.");
        }
    };

    const setupAudioAnalysis = (stream) => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            setAudioLevel(average);
            animationRef.current = requestAnimationFrame(update);
        };
        update();
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [stream]);

    const technicalQuestions = report?.technicalQuestions || [];
    const behavioralQuestions = report?.behavioralQuestions || [];
    const allQuestions = [...technicalQuestions, ...behavioralQuestions];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-inter min-h-screen py-8 px-6 transition-colors duration-300">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs">AI</span>
                        Interview Readiness
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Hardware Check */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden relative group">
                        {!permission ? (
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                                    <span className="material-symbols-outlined text-4xl">videocam</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500">Enable your camera and microphone to begin.</p>
                                <button
                                    onClick={startHardware}
                                    className="px-8 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Enable Devices
                                </button>
                            </div>
                        ) : (
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                                    <div className="flex items-end gap-1 h-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: `${Math.max(10, Math.min(100, (audioLevel / 50) * (i + 1) * 20))}%` }}
                                                className="w-1 bg-primary rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">Mic Working</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm mb-1">Check Lighting</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Ensure your face is well-lit for the best evaluation results.</p>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">network_check</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm mb-1">Internet Connection</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">A stable connection ensures real-time transcription works smoothly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Questions Preview */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft h-[500px] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
                                Session Questions
                            </h2>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 uppercase tracking-tighter">
                                {allQuestions.length} Items
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {allQuestions.length > 0 ? allQuestions.map((q, i) => (
                                <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-primary/30 transition-all group">
                                    <div className="flex items-start gap-3">
                                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors flex mt-0.5">#{i + 1}</span>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-normal line-clamp-2">{q.question}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                                    <p className="text-xs">Preparing questions...</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                disabled={!permission || allQuestions.length === 0}
                                onClick={() => navigate(`/interview/${interviewId}`)}
                                className={`w-full py-4 rounded-xl font-bold tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${permission && allQuestions.length > 0 ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                            >
                                START INTERVIEW
                                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewSetup;
