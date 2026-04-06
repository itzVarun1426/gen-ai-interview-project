import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true

})

const generateInterviewReport =async({selfDescription,jobDescription,resume})=>{
    try{
        const formData = new FormData();
        formData.append("selfDescription",selfDescription);
        formData.append("jobDescription",jobDescription);
        formData.append("resume",resume);

        const response = await api.post("/api/interview",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        if(!response.data){
            return res.status(404).json({
                message:"generateInterviewReport failed",
            })
        }
        console.log(response.data);
        return response.data;

    }
    catch(err){
        console.log("error in interview.api.js while generating interview report",err);
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

const getAllInterviewReportByUserId=async()=>{
    try{
        const response = await api.get("/api/interview");
        if(!response.data){
            return res.status(404).json({
                message:"No reports yet",
            })
        }
        return response.data;
    }
    catch(err){
        console.log("error in interview.api.js while getting all interview reports",err);
    }
}

export {generateInterviewReport,getInterviewReportById,getAllInterviewReportByUserId};