import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { updateUserProfile, getAllUsers, getUserByUsername, getMyProfile, getFriendsProfile } from '../controllers/userController.js'

const router = express.Router()
// api/users
router.get('/me', authMiddleware, getMyProfile)
router.put('/updateProfile', authMiddleware, updateUserProfile)
router.get('/visible', getAllUsers) // Has built-in Custom Middleware
router.get('/friends', authMiddleware, getFriendsProfile)
router.get('/:username', getUserByUsername)


export default router