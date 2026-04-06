import { getInterviewReportById,getAllInterviewReportByUserId,generateInterviewReport } from "../services/interview.api";
import { useContext } from "react";
import { interviewContext } from "../interview.context";

export const useInterview=()=>{
    const context = useContext(interviewContext);
    if(!context){
        throw new Error("useInterview must be used within InterviewProvider");
    }
    const {report , setReport , interviewLoading , setInterviewLoading,reports,setReports} = context;

    const handleGenerateInterviewReport = async({selfDescription,jobDescription,resume})=>{
        try{
            setInterviewLoading(true);
            const data = await generateInterviewReport({selfDescription,jobDescription,resume});
            console.log("data in useInterview.js",data);
            setReport(data.interviewReport);
            return data.interviewReport;
        }
        catch(err){
            console.log("error while handling generate interview report",err);
        }
        finally{
            setInterviewLoading(false);
        }
    }

    const handleGetAllInterviewReportByUserId = async()=>{
        try{
            setInterviewLoading(true);
            const data = await getAllInterviewReportByUserId();
            setReports(data.interviewReport);
        }
        catch(err){
            console.log("error while handling get all interview reports",err);
        }
        finally{
            setInterviewLoading(false);
        }
    }

    const handleGetInterviewReportById = async(interviewId)=>{
        try{
            setInterviewLoading(true);
            const data = await getInterviewReportById(interviewId);
            
            if (!data || !data.interviewReport) {
            console.log("Invalid data");
            return;
        }

            setReport(data.interviewReport);
            console.log("data in useInterview.js",data);

            
        }
        catch(err){
            console.log("error while handling get interview report by id",err);
        }
        finally{
            setInterviewLoading(false);
        }
    }


    return {handleGenerateInterviewReport,handleGetAllInterviewReportByUserId,handleGetInterviewReportById,report,interviewLoading,reports}
}

export default useInterview;

