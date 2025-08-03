import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
// SwapRequest.status: pending | cancelled | accepted | rejected | completion_requested | completed

// POST api/swapRequests/create
export const createSwapRequest = async (req, res) => {
    const { toUser, offeredSkills, requestedSkills, note } = req.body;
    const fromUser = req.user.id;

    // Validate input
    if(fromUser === toUser) {
        return res.status(400).json({ message: 'Cannot create a swap request with yourself' });
    } else if(!offeredSkills || !requestedSkills || offeredSkills.length === 0 || requestedSkills.length === 0) {
        return res.status(400).json({ message: 'Offered and requested skills cannot be empty' });
    }
    try {
        // Check if toUser exists
        const toUserExists = await User.findById(toUser);
        if(!toUserExists) {
            return res.status(404).json({ message: 'To user not found' });
        }
        // Create the swap request
        const swapRequest = await SwapRequest.create({ fromUser, toUser, offeredSkills, requestedSkills, note });
        res.status(201).json({
            message: 'Swap request created successfully',
            swapRequest
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating swap request', error });
    }
}

// DELETE api/swapRequests/:id
export const deleteSwapRequest = async (req, res) => {
    const swapRequestId = req.params.id
    // Validate input
    if(!swapRequestId) {
        return res.status(400).json({ message: 'Swap request ID is required' });
    }
    try {
        // Check if the swap request exists
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if(!swapRequest) {
            return res.status(200).json({ message: 'Swap request not found' });
        }
        // Check if the user is authorized to delete this swap request
        if(swapRequest.fromUser.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this swap request' });
        }
        // Delete the swap request
        const deletedSwapRequest = await SwapRequest.findByIdAndDelete(swapRequestId);
        res.status(200).json({ swapRequestId: deletedSwapRequest._id, message: 'Swap request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting swap request', error });
    }
}

// POST api/swapRequests/:action
export const acceptOrRejectSwapRequest = async (req, res) => {
    const { swapRequestId, action } = req.body
    // Validate input
    if(!swapRequestId || !action) {
        return res.status(400).json({ message: 'Swap request ID and action are required' });
    }
    if(!['accepted', 'rejected'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action. Must be either "accepted" or "rejected"' });
    }
    try {
        // Check if swapRequest exists
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if(!swapRequest) {
            return res.status(200).json({ message: 'Swap request not found' });
        }
        // Check if toUser is the one accepting or rejecting
        if(swapRequest.toUser.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to accept or reject this swap request' });
        }
        // Accept or reject the swap request
        const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(swapRequestId, { status: action }, { new: true });
        res.status(200).json({ message: `Swap request ${action} successfully`, swapRequestId: updatedSwapRequest._id });
    } catch (error) {
        res.status(500).json({ message: 'Error processing swap request', error });
    }
}

// POST api/swapRequests/complete/:id
export const requestSwapCompletion = async (req, res) => {
    const swapRequestId = req.params.id;
    // Validate input
    if(!swapRequestId) {
        return res.status(400).json({ message: 'Swap request ID is required' });
    }
    try {
        // Check if swapRequest exists
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if(!swapRequest) {
            return res.status(200).json({ message: 'Swap request not found' });
        }
        // Get the user who is requesting completion
        const userId = req.user.id;
        // Check if the user is authorized to request completion
        if(swapRequest.fromUser.toString() !== userId && swapRequest.toUser.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to request completion for this swap request' });
        }
        // Check swapRequest status
        if(swapRequest.status !== 'accepted') {
            return res.status(400).json({ message: 'Swap request is not in a state that allows completion' });
        }
        // Get the user who will receive the completion request
        const completionRequestReceivedBy = swapRequest.fromUser.toString() === userId ? swapRequest.toUser.toString() : swapRequest.fromUser.toString();
        // Make swapRequest status to completion_requested
        const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(swapRequestId, 
            { 
                status: 'completion_requested', 
                completion_request_sent: true, 
                completion_request_sent_by: userId,
                completion_request_received_by: completionRequestReceivedBy
            }, 
            { new: true }
        )
        // Notify the other user about the completion request (optional, not implemented here)

        // Respond with success message
        res.status(200).json({
            message: 'Swap request completion requested successfully',
            swapRequestId: updatedSwapRequest._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting swap completion', error });
    }
}

// POST api/swapRequests/complete-confirm/:id
export const confirmSwapCompletion = async (req, res) => {
    const swapRequestId = req.params.id;
    // Validate input
    if(!swapRequestId) {
        return res.status(400).json({ message: 'Swap request ID is required' });
    }
    try {
        // Check if swapRequest exists
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if(!swapRequest) {
            return res.status(200).json({ message: 'Swap request not found' });
        }
        // Check if the user is authorized to confirm completion
        const userId = req.user.id;
        if(userId !== swapRequest.completion_request_received_by.toString()) {
            return res.status(403).json({ message: 'You are not authorized to confirm completion for this swap request' });
        }
        // Check if the swapRequest status is completion_requested
        if(swapRequest.status !== 'completion_requested') {
            return res.status(400).json({ message: 'Swap request is not in a state that allows confirmation' });
        }

        // Update swapRequest status to completed
        const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(swapRequestId,
            {
                status: 'completed',
            },
            { new: true }
        );
        // Notify the other user about the completion (optional, not implemented here)

        // Respond with success message
        res.status(200).json({
            message: 'Swap request completed successfully',
            swapRequestId: updatedSwapRequest._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming swap completion', error });
    }
}

// GET api/swapRequests
export const getAllSwapRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const swapRequests = await SwapRequest.find({
            $or: [{ fromUser: userId }, { toUser: userId }]
        }).populate('fromUser', 'username email')
          .populate('toUser', 'username email');
        
        // Filter out requests with missing user data (in case users were deleted)
        const validSwapRequests = swapRequests.filter(req => req.fromUser && req.toUser);
        
        res.status(200).json(validSwapRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching swap requests', error });
    }
}

// GET api/swapRequests/:id
export const getSwapRequestById = async (req, res) => {
    const swapRequestId = req.params.id;
    // Validate input
    if(!swapRequestId) {
        return res.status(400).json({ message: 'Swap request ID is required' });
    }
    try {
        // Check if swapRequest exists
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if(!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }
        // Check if the user is authorized to view this swap request
        const userId = req.user.id;
        if(userId !== swapRequest.fromUser.toString() && userId !== swapRequest.toUser.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this swap request' });
        }
        // Respond with the swap request details
        res.status(200).json(swapRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching swap request', error });
    }
}