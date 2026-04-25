import React, { useEffect, useState, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import { getInterviewReportById, submitAnswer, completeInterview } from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';

const Interview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, setReport } = useContext(interviewContext);

    // Flow states
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionType, setQuestionType] = useState('technical'); // 'technical' or 'behavioral'
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [interviewFinished, setInterviewFinished] = useState(false);

    // Media states
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [transcription, setTranscription] = useState("");
    const [fullTranscription, setFullTranscription] = useState([]); // List of { role: 'user'|'ai', text: string }

    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const scrollRef = useRef(null);

    // Fetch report on mount
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

    // Setup Media & Speech
    useEffect(() => {
        const initMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: 1280, height: 720 }, 
                    audio: true 
                });
                setStream(mediaStream);
                if (videoRef.current) videoRef.current.srcObject = mediaStream;
            } catch (err) {
                console.error("Media Error:", err);
            }
        };

        const setupRecognition = () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = true;
                rec.interimResults = true;
                rec.lang = 'en-US';

                rec.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    setTranscription(finalTranscript + interimTranscript);
                };

                recognitionRef.current = rec;
            }
        };

        initMedia();
        setupRecognition();

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    // Scroll transcription to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcription, fullTranscription]);

    const getCurrentQuestion = () => {
        const questions = questionType === 'technical' ? report?.technicalQuestions : report?.behavioralQuestions;
        return questions ? questions[currentQuestionIndex] : null;
    };

    const speakQuestion = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    // Auto-speak first question
    useEffect(() => {
        const q = getCurrentQuestion();
        if (q && !interviewFinished) {
            speakQuestion(q.question);
        }
    }, [currentQuestionIndex, questionType, report]);

    const startRecording = () => {
        if (!stream) return;
        
        setIsRecording(true);
        setTranscription("");
        setAudioChunks([]);

        // Start STT
        if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) {}
        }

        // Start Audio Capture
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) setAudioChunks(prev => [...prev, e.data]);
        };
        recorder.start();
        setMediaRecorder(recorder);
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        if (mediaRecorder) mediaRecorder.stop();
    };

    const handleNext = async () => {
        if (isRecording) stopRecording();
        
        setIsProcessing(true);
        const currentQ = getCurrentQuestion();
        
        // Prepare audio blob
        let audioBlob = null;
        if (audioChunks.length > 0) {
            audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        }

        try {
            // Submit to backend
            await submitAnswer(interviewId, {
                questionType,
                questionIndex: currentQuestionIndex,
                userAnswer: transcription,
                audioBlob
            });

            // Update transcript history
            setFullTranscription(prev => [
                ...prev, 
                { role: 'ai', text: currentQ.question },
                { role: 'user', text: transcription || "(No verbal answer provided)" }
            ]);

            // Move to next
            const questions = questionType === 'technical' ? report?.technicalQuestions : report?.behavioralQuestions;
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else if (questionType === 'technical') {
                setQuestionType('behavioral');
                setCurrentQuestionIndex(0);
            } else {
                setInterviewFinished(true);
                await completeInterview(interviewId);
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setIsProcessing(false);
            setTranscription("");
        }
    };
    const handleEndInterview = async () => {
        if (!window.confirm("Are you sure you want to end the interview early? Your answers so far will be saved.")) return;
        
        setIsEnding(true);
        try {
            await completeInterview(interviewId);
            setInterviewFinished(true);
        } catch (err) {
            console.error("End interview error:", err);
        } finally {
            setIsEnding(false);
        }
    };

    if (interviewFinished) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 space-y-8">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl">task_alt</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Interview Completed!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Great job! We are finalizing your evaluation report now.</p>
                    <button 
                        onClick={() => navigate(`/evaluation/${interviewId}`)}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        VIEW FULL REPORT
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQ = getCurrentQuestion();

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-inter h-screen max-h-screen overflow-hidden flex flex-col transition-colors duration-300">
            {/* Top Bar */}
            <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xs font-bold uppercase tracking-wider">Active Session</h1>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{questionType} Phase • Question {currentQuestionIndex + 1}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleEndInterview}
                        disabled={isEnding || isProcessing}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50"
                    >
                        {isEnding ? "Ending..." : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">exit_to_app</span>
                                End Interview
                            </>
                        )}
                    </button>
                    <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/10 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">Live</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative min-h-0">
                {/* Left Panel: Camera & Question */}
                <div className="lg:col-span-8 flex flex-col relative h-full min-h-0">
                    {/* Background Visual (Graphic EQ) */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
                         <div className="flex gap-2 h-64 items-end">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: isRecording ? [20, 100, 40, 80, 20] : 20 }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                                    className="w-2 bg-primary rounded-full"
                                />
                            ))}
                         </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 min-h-0">
                        {/* Question Card */}
                        <motion.div 
                            key={currentQ?.question}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft max-w-2xl w-full mb-12 overflow-y-auto"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Interviewer</span>
                                <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                                "{currentQ?.question}"
                            </h2>
                        </motion.div>

                        {/* Camera Preview (Floating) */}
                        <motion.div 
                            drag
                            dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
                            className="w-48 aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 cursor-move absolute bottom-8 right-8 z-40"
                        >
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 rounded-lg backdrop-blur-md">
                                <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                                <span className="text-[8px] font-bold text-white uppercase tracking-widest">{isRecording ? 'REC' : 'IDLE'}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Controls Footer */}
                    <div className="h-24 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-6 px-6 z-50 shrink-0">
                        <motion.button 
                            disabled={isProcessing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => isRecording ? stopRecording() : startRecording()}
                            className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-xs tracking-widest transition-all ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{isRecording ? 'stop_circle' : 'mic'}</span>
                            {isRecording ? 'PROCESS ANSWER' : 'START RECORDING'}
                        </motion.button>

                        <motion.button 
                            disabled={isProcessing || isRecording}
                            whileHover={{ scale: 1.05 }}
                            onClick={handleNext}
                            className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-xs tracking-widest transition-all border ${!isRecording && !isProcessing ? 'border-primary text-primary hover:bg-primary/5' : 'border-slate-200 text-slate-300 pointer-events-none'}`}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    SYNCING...
                                </>
                            ) : (
                                <>
                                    SUBMIT & NEXT
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Right Panel: Transcription Sidebar */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] min-h-0">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold flex items-center gap-2 text-sm tracking-tight">
                            <span className="material-symbols-outlined text-primary text-[20px]">closed_caption</span>
                            Live Transcription
                        </h2>
                        {isRecording && <div className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-[9px] font-black rounded uppercase tracking-widest animate-pulse">listening</div>}
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {fullTranscription.map((chat, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: chat.role === 'ai' ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i} 
                                className={`flex flex-col ${chat.role === 'ai' ? 'items-start' : 'items-end'}`}
                            >
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{chat.role}</span>
                                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed max-w-[90%] ${chat.role === 'ai' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none' : 'bg-primary/10 dark:bg-primary/20 text-primary rounded-tr-none border border-primary/10'}`}>
                                    {chat.text}
                                </div>
                            </motion.div>
                        ))}
                        
                        {isRecording && transcription && (
                            <div className="flex flex-col items-end animate-pulse">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">User (Current)</span>
                                <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 text-primary text-[13px] leading-relaxed max-w-[90%] rounded-tr-none border border-primary/5 italic">
                                    {transcription}...
                                </div>
                            </div>
                        )}

                        {fullTranscription.length === 0 && !isRecording && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-50">
                                <span className="material-symbols-outlined text-5xl mb-3">interpreter_mode</span>
                                <p className="text-xs font-medium text-center">Your conversation history<br/>will appear here.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-center text-slate-400 font-medium">Transcribing in real-time via Web Speech API</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Interview;