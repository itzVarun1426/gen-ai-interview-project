import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import interviewController from '../controllers/interview.controller.js';
import upload from '../middlewares/file.middleware.js';


const router = express.Router();

/**
 * @route POST /api/interview
 * @description generate the interview report and questions for the candidate on the basis of self description , job desctription and resume
 * @access private
 */

router.post('/',authMiddleware.authUser, upload.single('resume'),interviewController.generateInterviewReportController);

export default router;