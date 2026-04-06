import { createContext, useState } from "react";

export const interviewContext = createContext();

export const InterviewProvider = ({children})=>{
    const [interviewLoading,setInterviewLoading] = useState(false);
    const [report , setReport] = useState(null);
    const [reports , setReports] = useState([]);


    return(
        <interviewContext.Provider value={{interviewLoading,setInterviewLoading,report,setReport,reports,setReports}}>
            {children}
        </interviewContext.Provider>
    )
}
