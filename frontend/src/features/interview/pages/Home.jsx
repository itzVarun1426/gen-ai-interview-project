import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import {useInterview} from '../hooks/useInterview.js';

const Home = () => {

    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const resumeInputFile = useRef();

    const {interviewLoading , handleGenerateInterviewReport,reports} = useInterview();
    console.log("reports",reports)

    if(interviewLoading){
        return <main><h1>....Loading</h1></main>
    }

    const navigate = useNavigate()

    const handleSubmit=async ()=>{
        try{
            const resume = resumeInputFile.current.files[0];
            if (!resume) {
                alert("Please upload resume");
                return;
            }
            const data = await handleGenerateInterviewReport({
                jobDescription,
                selfDescription,
                resume
            });


            if (!data) {
                console.log("No data received");
                return;
                }


            navigate(`/interview`);


        }
        catch(err){
            console.log('error while in home .jsx file',err);
        }
    }

    return (
        <>
        <div className='home-page'>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <h2>Target Job Description</h2>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>0 / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className='dropzone' htmlFor='resume'>
                                <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                <input ref={resumeInputFile} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                            </label>
                        </div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleSubmit}
                        className='generate-btn'>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>      
        </div>
     

        </>
        
    )
}

export default Home