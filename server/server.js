import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
// Routes
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import swapRequestRoutes from "./routes/swapRequestRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"

const app = express()
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

dotenv.config()
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Routers
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/swapRequests', swapRequestRoutes)
app.use('/api/feedback', feedbackRoutes)

mongoose.connect(MONGO_URI)
.then(()=>{
    console.log('✅ Connected to MongoDB');
})
.catch((err)=>{
    console.error('❌ MongoDB connection error:', err);
})

app.get('/', (req, res)=>{
    res.send("Hello World!")
})
app.listen(PORT, (req, res)=>{
    console.log(`Server listening on: http://localhost:${PORT}`)
})
