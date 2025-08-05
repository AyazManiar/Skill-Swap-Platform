import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { updateUserProfile, getAllUsers, getUserByUsername, getMyProfile, 
    getFriendsProfile, getIncomingFriendRequests, getOutgoingFriendRequests,
    sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend 
} from '../controllers/userController.js'

const router = express.Router()
// api/users
router.get('/visible', getAllUsers) // Has built-in Custom Middleware
router.get('/:username', getUserByUsername)
router.get('/me', authMiddleware, getMyProfile)
router.put('/updateProfile', authMiddleware, updateUserProfile)
// Friends
router.get('/friends', authMiddleware, getFriendsProfile)
router.get('/friend-requests/incoming', authMiddleware, getIncomingFriendRequests)
router.get('/friend-requests/outgoing', authMiddleware, getOutgoingFriendRequests)
router.post('/sendFriendRequest', authMiddleware, sendFriendRequest)
router.post('/acceptFriendRequest', authMiddleware, acceptFriendRequest)
router.post('/rejectFriendRequest', authMiddleware, rejectFriendRequest)
router.post('/cancelFriendRequest', authMiddleware, cancelFriendRequest)
router.delete('/removeFriend', authMiddleware, removeFriend)


export default router