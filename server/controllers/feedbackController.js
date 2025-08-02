import Feedback from "../models/Feedback.js";
import SwapRequest from "../models/SwapRequest.js";

// POST /api/feedback/create
export const createFeedback = async (req, res) => {
    const { swapRequestId, targetUserId, rating, comment } = req.body;
    // Validate input
    if(!swapRequestId){
        return res.status(400).json({ message: 'Swap request ID is required' });
    }
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating is required and must be between 1 and 5' });
    }
    if (!targetUserId) {
        return res.status(400).json({ message: 'Target user ID is required' });
    }
    
    const userId = req.user.id;
    try {
        // Get SwapRequest to check if it exists and is completed
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }
        
        // Check if swap request is completed
        if (swapRequest.status !== 'completed') {
            return res.status(400).json({ message: 'Feedback can only be given for completed swap requests' });
        }
        
        // Check if user is authorized to give feedback on this swap request
        if (swapRequest.fromUser.toString() !== userId && swapRequest.toUser.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to give feedback on this swap request' });
        }
        
        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({ 
            swapRequest: swapRequestId, 
            user: userId 
        });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already given for this swap request' });
        }
        
        // Create Feedback
        const feedback = await Feedback.create({
            swapRequest: swapRequestId,
            user: userId,
            targetUser: targetUserId,
            rating,
            comment
        });
        
        res.status(201).json({ message: 'Feedback created successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback', error: error.message });
    }
}

// GET /api/feedback/check/:swapRequestId
export const checkFeedbackGiven = async (req, res) => {
    const { swapRequestId } = req.params;
    const userId = req.user.id;
    
    try {
        const feedback = await Feedback.findOne({ 
            swapRequest: swapRequestId, 
            user: userId 
        }).populate('targetUser', 'username');
        
        res.status(200).json({ 
            feedbackGiven: !!feedback,
            feedback: feedback || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking feedback', error: error.message });
    }
}

// GET /api/feedback
export const getAllFeedbacks = async (req, res) => {
    const userId = req.user.id;
    try {
        const feedbacks = await Feedback.find({ user: userId }).populate('swapRequest');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks', error });
    }
}