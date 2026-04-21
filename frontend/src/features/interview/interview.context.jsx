import { createContext, useState, useCallback } from "react";
import { generateInterviewReport as generateReportApi, getAllInterviewReportByUserId, deleteInterviewReport as deleteReportApi } from "./services/interview.api.js";

export const interviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    // Input States
    const [selfDescription, setSelfDescription] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);

    // AI Processing States
    const [interviewLoading, setInterviewLoading] = useState(false);
    const [interviewError, setInterviewError] = useState(null);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    const handleGenerateReport = useCallback(async () => {
        setInterviewLoading(true);
        setInterviewError(null);
        try {
            const data = await generateReportApi({
                selfDescription,
                jobDescription,
                resume: resumeFile
            });

            if (data?.interviewReport) {
                setReport(data.interviewReport);
                return data.interviewReport;
            } else {
                setInterviewError(data?.error || "Failed to generate interview report");
                return null;
            }
        } catch (err) {
            console.error("Context Error:", err);
            setInterviewError("Connection to server lost. Please try again.");
            return null;
        } finally {
            setInterviewLoading(false);
        }
    }, [selfDescription, jobDescription, resumeFile]);

    const handleFetchReports = useCallback(async () => {
        try {
            const data = await getAllInterviewReportByUserId();
            if (data && Array.isArray(data)) {
                setReports(data);
            }
        } catch (error) {
            console.error("Failed to fetch recent reports:", error);
        }
    }, []);
    const handleDeleteReport = useCallback(async (interviewId) => {
        try {
            await deleteReportApi(interviewId);
            setReports(prev => prev.filter(report => (report._id || report.id) !== interviewId));
            return true;
        } catch (error) {
            console.error("Failed to delete report:", error);
            return false;
        }
    }, []);

    return (
        <interviewContext.Provider value={{
            // Inputs
            selfDescription, setSelfDescription,
            jobDescription, setJobDescription,
            resumeFile, setResumeFile,

            // Processing
            interviewLoading, setInterviewLoading,
            interviewError, setInterviewError,
            report, setReport,
            reports, setReports,

            // Actions
            handleGenerateReport,
            handleFetchReports,
            handleDeleteReport
        }}>
            {children}
        </interviewContext.Provider>
    );
};
