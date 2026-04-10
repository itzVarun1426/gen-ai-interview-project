import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, handleGetInterviewReportById, interviewLoading } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            console.log("Fetching ID:", interviewId)
            handleGetInterviewReportById(interviewId)
        }
    }, [interviewId])

    useEffect(() => {
        if (report) {
            console.log("REPORT UPDATED:", report)
        }
    }, [report])

    if (interviewLoading) {
        return <h2 style={{ textAlign: "center" }}>Loading...</h2>
    }

    if (!report) {
        return <h2 style={{ textAlign: "center" }}>No Data Found</h2>
    }

    return (
        <div style={{ padding: "20px" }}>

            <h1>Interview Report</h1>

            {/* NAV */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setActiveNav('technical')}>Technical</button>
                <button onClick={() => setActiveNav('behavioral')}>Behavioral</button>
                <button onClick={() => setActiveNav('roadmap')}>Roadmap</button>
            </div>

            {/* TECHNICAL */}
            {activeNav === 'technical' && (
                <div>
                    <h2>Technical Questions</h2>

                    {report.technicalQuestions?.map((q, i) => (
                        <div key={i} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                            <p><b>Q:</b> {q.question}</p>
                            <p><b>Intention:</b> {q.intention}</p>
                            <p><b>Answer:</b> {q.answer}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* BEHAVIORAL */}
            {activeNav === 'behavioral' && (
                <div>
                    <h2>Behavioral Questions</h2>

                    {report.behavioralQuestions?.map((q, i) => (
                        <div key={i} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                            <p><b>Q:</b> {q.question}</p>
                            <p><b>Intention:</b> {q.intention}</p>
                            <p><b>Answer:</b> {q.answer}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ROADMAP */}
            {activeNav === 'roadmap' && (
                <div>
                    <h2>Preparation Plan</h2>

                    {report.preparationPlan?.map((day, i) => (
                        <div key={i} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                            <p><b>Day:</b> {day.day}</p>
                            <p><b>Focus:</b> {day.focused_topic}</p>

                            <ul>
                                {day.task?.map((t, idx) => (
                                    <li key={idx}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* SKILL GAPS */}
            <div style={{ marginTop: "20px" }}>
                <h2>Skill Gaps</h2>
                {report.skillsGaps?.map((gap, i) => (
                    <div key={i} style={{ border: "1px solid red", margin: "5px", padding: "5px" }}>
                        <p>{gap.skill} - {gap.severity}</p>
                    </div>
                ))}
            </div>

            {/* DEBUG */}
            <div style={{ marginTop: "30px" }}>
                <h3>Raw JSON:</h3>
                <pre>{JSON.stringify(report, null, 2)}</pre>
            </div>

        </div>
    )
}

export default Interview