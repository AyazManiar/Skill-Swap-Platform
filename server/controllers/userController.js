import User from "../models/User.js"
import jwt from 'jsonwebtoken'; // used in getAllUsers's custom Auth Middleware

// GET api/users/me - Get current user's full profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server Error, Database side, error: ' + error.message 
        });
    }
}
 
// PUT api/users/updateProfile
export const updateUserProfile = async (req, res) => {
    // Getting userId from request body
    const { userId } = req.body;
    // Authenticating User, req.user.id: Getting userId from authMiddleware
    console.log("Updateprofile, UserId:", userId)
    console.log("Req user id: ", req.user.id)
    if(userId != req.user.id){
        return res.status(403).json({ message: 'Forbidden: You are not allowed to update this profile.' });
    }
    try {
        // Only update fields that are provided
        const updatedUser = await User.findByIdAndUpdate(
            userId, // Find by
            { $set: req.body }, // Update fields
            { new: true, runValidators: true } // Options: return the updated document, run validators
        )
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server Error, Database side, error: ' + error.message });
    }
}

// GET api/users/visible?availability=Weekends&availability=Evenings
export const getAllUsers = async (req, res) => {
    let isLoggedIn = false;
    let userId = null;
    let friendsId = [];

    const token = req.cookies?.token;

    // Token auth check
    if (!token) {
        console.log('No token found. User is not logged in.');
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded.id);

            if (user) {
                isLoggedIn = true;
                userId = decoded.id;

                // Fetch the user's friends list
                const currentUser = await User.findById(userId).select('friends');
                friendsId = currentUser?.friends || [];
                console.log('User is logged in. Friends list fetched.');
            } else {
                console.log('Token valid, but user not found.');
            }
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ message: 'Unauthorized: Invalid token or user lookup failed' });
        }
    }

    // Handle availability query
    const availabilityQuery = req.query.availability;
    const requestedAvailability = Array.isArray(availabilityQuery)
        ? availabilityQuery
        : availabilityQuery
            ? [availabilityQuery]
            : ['Always']; // Default if not provided

    // Handle search query
    const searchQuery = req.query.search;

    try {
        // Build visibility conditions
        let visibilityConditions = [{ isPublic: true }];
        if (isLoggedIn && friendsId.length > 0) {
            visibilityConditions.push({ _id: { $in: friendsId } });
        }
        
        // Build final query filter
        let queryConditions = [
            { availability: { $in: requestedAvailability } },
            { $or: visibilityConditions },
            { isBanned: false }
        ];
        
        // Add search conditions if search query is provided
        if (searchQuery && searchQuery.trim() !== '') {
            const searchRegex = new RegExp(searchQuery.trim(), 'i'); // Case-insensitive search
            queryConditions.push({
                $or: [
                    { username: { $regex: searchRegex } },
                    { bio: { $regex: searchRegex } },
                    { skills: { $elemMatch: { $regex: searchRegex } } },
                    { skillsWanted: { $elemMatch: { $regex: searchRegex } } }
                ]
            });
        }
        
        if (userId) {
            queryConditions.push({ _id: { $ne: userId } }); // Exclude self
        }
        const filters = { $and: queryConditions };

        const visibleUsers = await User.find(filters)
            .select('username profilePicture bio availability skills skillsWanted averageRating reviewCount');
        if (!visibleUsers || visibleUsers.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        return res.status(200).json(visibleUsers);
    } catch (error) {
        console.error('Error fetching visible users:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


// GET api/users/:username
export const getUserByUsername = async (req, res) => {
    let { username } = req.params;
    // Proper username encoding
    username = decodeURIComponent(username);
    console.log('Fetching user by username:', username);
    
    // Check if user is authenticated (optional authentication)
    let requesterId = null;
    let isAdmin = false;
    
    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const requester = await User.findById(decoded.id);
            if (requester) {
                requesterId = decoded.id;
                isAdmin = requester.role === 'admin';
            }
        } catch (error) {
            console.log('Invalid token or user not found, proceeding as guest');
        }
    }
    
    try {
        const user = await User.findOne({ username }).select('username isPublic profilePicture bio availability skills skillsWanted averageRating reviewCount friends');
        if (!user) return res.status(200).json( { found: false, message: 'User not found' });
        const isFriend = requesterId && user.friends.includes(requesterId);
        
        // If user is not public, check if the requester is friend or an admin
        if (!user.isPublic) {
            if (!isAdmin && !isFriend) {
                // Only return basic info if not public and not friend/admin
                return res.status(200).json({
                    found: true,
                    isFriend: isFriend,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    bio: user.bio
                });
            }
        }
        
        // Remove friends array from user object before sending
        const { friends, ...userWithoutFriends } = user.toObject();
        return res.status(200).json({ found: true, user: userWithoutFriends, isFriend });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error, Database side, error: ' + error.message });
    }
}


// Get all Friends Profile
// GET /api/users/friends
export const getFriendsProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('friends');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const friendProfiles = await User.find({ _id: { $in: user.friends } })
            .select('username profilePicture availability skills skillsWanted averageRating reviewCount');
        return res.status(200).json(friendProfiles);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// GET /api/users/friend-requests/incoming
export const getIncomingFriendRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('friendsRequestsReceived');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const incomingRequests = await User.find({ _id: { $in: user.friendsRequestsReceived } })
            .select('username profilePicture availability skills skillsWanted averageRating reviewCount createdAt');
        return res.status(200).json(incomingRequests);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// GET /api/users/friend-requests/outgoing
export const getOutgoingFriendRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('friendsRequestsSent');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const outgoingRequests = await User.find({ _id: { $in: user.friendsRequestsSent } })
            .select('username profilePicture availability skills skillsWanted averageRating reviewCount createdAt');
        return res.status(200).json(outgoingRequests);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// POST api/users/sendFriendRequest
export const sendFriendRequest = async (req, res) => {
    const { targetId } = req.body
    const userId = req.user.id;

    if(targetId === userId) {
        return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    try {
        // Add target user to your sent list
        await User.findByIdAndUpdate(userId, {
            $addToSet: { friendsRequestsSent: targetId }
        });
        // Add yourself to target user's received list
        await User.findByIdAndUpdate(targetId, {
            $addToSet: { friendsRequestsReceived: userId }
        });
        return res.status(200).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// POST api/users/acceptFriendRequest
export const acceptFriendRequest = async (req, res) => {
    const { targetId } = req.body
    const userId = req.user.id;

    if(targetId === userId) {
        return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    try {
        // Add each other as friends
        await User.findByIdAndUpdate(userId, {
            $pull: { friendsRequestsReceived: targetId },
            $addToSet: { friends: targetId }
        });

        await User.findByIdAndUpdate(targetId, {
            $pull: { friendsRequestsSent: userId },
            $addToSet: { friends: userId }
        });
        return res.status(200).json({ message: 'Friend request accepted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// POST api/users/rejectFriendRequest
export const rejectFriendRequest = async (req, res) => {
    const { targetId } = req.body
    const userId = req.user.id;

    if(targetId === userId) {
        return res.status(400).json({ message: 'You cannot reject a friend request from yourself.' });
    }

    try {
        // Remove each other from friend request lists
        await User.findByIdAndUpdate(userId, {
            $pull: { friendsRequestsReceived: targetId }
        });

        await User.findByIdAndUpdate(targetId, {
            $pull: { friendsRequestsSent: userId }
        });
        return res.status(200).json({ message: 'Friend request rejected successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// POST api/users/cancelFriendRequest
export const cancelFriendRequest = async (req, res) => {
    const { targetId } = req.body
    const userId = req.user.id;

    if(targetId === userId) {
        return res.status(400).json({ message: 'You cannot cancel a friend request to yourself.' });
    }

    try {
        // Remove from sent requests (user perspective) and received requests (target perspective)
        await User.findByIdAndUpdate(userId, {
            $pull: { friendsRequestsSent: targetId }
        });

        await User.findByIdAndUpdate(targetId, {
            $pull: { friendsRequestsReceived: userId }
        });
        return res.status(200).json({ message: 'Friend request cancelled successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

// DELETE api/users/removeFriend
export const removeFriend = async (req, res) => {
    const { targetId } = req.body;
    const userId = req.user.id;

    if(targetId === userId) {
        return res.status(400).json({ message: 'You cannot remove yourself as a friend.' });
    }

    try {
        // Remove each other from friends list
        await User.findByIdAndUpdate(userId, {
            $pull: { friends: targetId }
        });
        await User.findByIdAndUpdate(targetId, {
            $pull: { friends: userId }
        });
        return res.status(200).json({ message: 'Friend removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}