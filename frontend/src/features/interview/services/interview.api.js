import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true

})

const generateInterviewReport = async ({ selfDescription, jobDescription, resume }) => {
    try {
        const formData = new FormData();
        formData.append("selfDescription", selfDescription || "");
        formData.append("jobDescription", jobDescription || "");

        if (resume && resume instanceof File) {
            formData.append("resume", resume);
        }

        const response = await api.post("/api/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while generating interview report", err);
        throw err; // Propagate error for the context to handle
    }
}

const getInterviewReportById = async (interviewId) => {
    try {
        if (!interviewId) {
            console.log("interviewId is required");
            return null;
        }

        const response = await api.get(`/api/interview/report/${interviewId}`);

        console.log("API RESPONSE:", response.data); // 🔥 DEBUG

        if (!response.data) {
            console.log("No reports yet");
            return null;
        }

        return response.data;

    } catch (err) {
        console.log("error in interview.api.js while getting interview report by id", err);
        return null;
    }
};

const getAllInterviewReportByUserId = async () => {
    try {
        const response = await api.get("/api/interview");
        if (!response.data || !response.data.reports) {
            return [];
        }
        return response.data.reports;
    }
    catch (err) {
        console.log("error in interview.api.js while getting all interview reports", err);
    }
}

const deleteInterviewReport = async (interviewId) => {
    try {
        const response = await api.delete(`/api/interview/${interviewId}`);
        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while deleting interview report", err);
        throw err;
    }
}

const submitAnswer = async (interviewId, { questionType, questionIndex, userAnswer, audioBlob }) => {
    try {
        const formData = new FormData();
        formData.append("questionType", questionType);
        formData.append("questionIndex", questionIndex);
        formData.append("userAnswer", userAnswer || "");
        
        if (audioBlob) {
            formData.append("audio", audioBlob, "answer.webm");
        }

        const response = await api.post(`/api/interview/${interviewId}/answer`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while submitting answer", err);
        throw err;
    }
}

const completeInterview = async (interviewId) => {
    try {
        const response = await api.post(`/api/interview/${interviewId}/complete`);
        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while completing interview", err);
        throw err;
    }
}

export { 
    generateInterviewReport, 
    getInterviewReportById, 
    getAllInterviewReportByUserId, 
    deleteInterviewReport,
    submitAnswer,
    completeInterview
};