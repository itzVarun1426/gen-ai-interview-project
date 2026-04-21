import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { generateInterviewReport, evaluateAnswer } from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

async function generateInterviewReportController(req, res) {
    try {
        console.log("INTERNAL_DEBUG: Complete req.body:", req.body);
        console.log("INTERNAL_DEBUG: req.file metadata:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : "NO_FILE");

        const { selfDescription, jobDescription } = req.body;
        let resumeText = "";

        // Handle Resume Parsing if file is provided
        if (req.file) {
            try {
                const pdfParser = new pdf.PDFParse({ data: req.file.buffer });
                const textResult = await pdfParser.getText();
                resumeText = textResult.text || "";
                console.log("Resume parsed successfully. Length:", resumeText.length);
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return res.status(400).json({ error: 'Failed to parse PDF resume' });
            }
        }

        // Detailed validation
        if (!jobDescription) {
            console.log("INTERNAL_DEBUG: Missing jobDescription");
            return res.status(400).json({ error: 'Job Description is missing.' });
        }
        if (!selfDescription && !resumeText) {
            console.log("INTERNAL_DEBUG: Missing profile context (no bio and no resume text)");
            return res.status(400).json({ error: 'Please provide either a Bio or a Resume.' });
        }

        const interviewReportGeneratedByAI = await generateInterviewReport({
            resume: resumeText || "Not provided",
            selfDescription: selfDescription || "Not provided",
            jobDescription
        });

        if (!interviewReportGeneratedByAI) {
            return res.status(500).json({
                message: "AI generation failed"
            });
        }

        const interviewReport = await interviewReportModel.create({
            jobDescription,
            resume: resumeText,
            selfDescription,
            user: req.decoded.id,
            ...interviewReportGeneratedByAI
        });

        res.status(200).json({
            message: 'Interview report generated successfully',
            interviewReport
        });

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ error: 'Failed to generate interview report' });
    }
}

async function getInterviewByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            return res.status(400).json({
                message: "interview id is required"
            });
        }
        const interviewReport = await interviewReportModel.findById(interviewId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "interview report not found"
            });

        }
        res.status(200).json({
            message: "interview report found",
            interviewReport
        });
    }
    catch (err) {
        console.error("getInterviewById Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllInterviewReportByUserId(req, res) {
    try {
        const user = req.decoded.id;
        const reports = await interviewReportModel.find({ user })
            .sort({ createdAt: -1 })
            .select("-resume -jobDescription -selfDescription -skillsGaps -behavioralQuestions -technicalQuestions -__v -preparationPlan");

        if (!reports) {
            return res.status(404).json({
                message: "interview reports not found"
            });
        }
        res.status(200).json({
            message: "interview reports found",
            reports
        });

    }
    catch (err) {
        console.error("getAllInterviewReport Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        const user = req.decoded.id;

        if (!interviewId) {
            return res.status(400).json({
                message: "interview id is required"
            });
        }

        const deletedReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user });

        if (!deletedReport) {
            return res.status(404).json({
                message: "interview report not found or you are not authorized to delete it"
            });
        }

        res.status(200).json({
            message: "interview report deleted successfully"
        });

    } catch (err) {
        console.error("deleteInterviewReport Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function submitAnswerController(req, res) {
    try {
        const { interviewId } = req.params;
        const { questionType, questionIndex, userAnswer } = req.body;
        const audioFile = req.file;

        if (!interviewId || !questionType || questionIndex === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const report = await interviewReportModel.findById(interviewId);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        // Get the specific question
        const questionList = questionType === 'technical' ? report.technicalQuestions : report.behavioralQuestions;
        const questionObj = questionList[questionIndex];

        if (!questionObj) return res.status(404).json({ error: 'Question not found' });

        let audioBase64 = null;
        if (audioFile) {
            audioBase64 = audioFile.buffer.toString('base64');
        }

        // Evaluate using Gemini
        const evaluation = await evaluateAnswer({
            question: questionObj.question,
            intention: questionObj.intention,
            modelAnswer: questionObj.answer,
            userAnswer: userAnswer || "",
            audioBase64,
            mimeType: audioFile?.mimetype || 'audio/webm'
        });

        // Update the question object in the array manually
        const updateKey = `${questionType}Questions.${questionIndex}`;
        await interviewReportModel.updateOne(
            { _id: interviewId },
            {
                $set: {
                    [`${updateKey}.userAnswer`]: evaluation.userAnswer,
                    [`${updateKey}.feedback`]: {
                        improvements: evaluation.improvements,
                        drawbacks: evaluation.drawbacks,
                        score: evaluation.score
                    },
                    status: 'in-progress'
                }
            }
        );

        res.status(200).json({
            message: 'Answer submitted and evaluated',
            evaluation
        });

    } catch (err) {
        console.error("submitAnswer Error:", err);
        res.status(500).json({ error: 'Failed to process answer' });
    }
}

async function completeInterviewController(req, res) {
    try {
        const { interviewId } = req.params;
        await interviewReportModel.findByIdAndUpdate(interviewId, { status: 'completed' });
        res.status(200).json({ message: 'Interview completed' });
    } catch (err) {
        console.error("completeInterview Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { 
    generateInterviewReportController, 
    getInterviewByIdController, 
    getAllInterviewReportByUserId, 
    deleteInterviewReportController,
    submitAnswerController,
    completeInterviewController
};