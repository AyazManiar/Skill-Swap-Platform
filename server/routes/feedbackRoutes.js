import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { createFeedback, getAllFeedbacks, checkFeedbackGiven } from '../controllers/feedbackController.js'

const router = express.Router()

// api/feedback
router.post('/create', authMiddleware, createFeedback)
router.get('/check/:swapRequestId', authMiddleware, checkFeedbackGiven)
router.get('/', authMiddleware, getAllFeedbacks)


export default router