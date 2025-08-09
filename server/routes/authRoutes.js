import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { signup, login, logout, checkLoggedin } from "../controllers/authController.js"
const router = express.Router()
router.post('/signUp', signup)
router.post('/logIn', login)
router.post('/logOut', logout)
router.get('/checkLoggedIn', authMiddleware, checkLoggedin)
export default router