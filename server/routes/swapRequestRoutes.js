import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { createSwapRequest, deleteSwapRequest,
    acceptOrRejectSwapRequest, requestSwapCompletion, confirmSwapCompletion,
    getAllSwapRequests, getSwapRequestById
 } from '../controllers/swapRequestController.js'
const router = express.Router()
router.post('/create', authMiddleware, createSwapRequest)
router.delete('/:id', authMiddleware, deleteSwapRequest)
router.post('/:action', authMiddleware, acceptOrRejectSwapRequest)
router.post('/complete/:id', authMiddleware, requestSwapCompletion)
router.post('/complete-confirm/:id', authMiddleware, confirmSwapCompletion)
router.get('/', authMiddleware, getAllSwapRequests)
router.get('/:id', authMiddleware, getSwapRequestById)
export default router