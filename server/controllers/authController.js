import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const createAndSetTokenInCookies = (user, res) =>{
    // Set Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
    });
    // Set cookie (HttpOnly)
    res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });
}

// POST api/auth/signUp
export const signup = async (req, res) => {
    // Take info
    console.log("SIGNUP, req.body: ", req.body)
    const { username, email, password } = req.body
    try {
        // Check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const message = 'Email already in use';
            console.log("Response:", { status: 400, message });
            return res.status(400).json({ message });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create User in database
        const user = await User.create({ username, email, password: hashedPassword })
        if(!user){
            const message = 'User creation failed';
            console.log("Response:", { status: 500, message });
            return res.status(500).json({ message });
        }
        // Creates token and set it in httpOnlyCookies
        createAndSetTokenInCookies(user, res)
        
        res.status(201).json({ 
            message: 'User created', 
            userId: user._id, 
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            friendList: user.friends || []
        });
    } catch (error) {
        const errorResponse = {
            status: 500,
            message: 'Signup error',
            error: error.message
        };
        console.log("Response:", errorResponse);
        res.status(500).json(errorResponse);
    }
}

// POST api/auth/logIn
export const login = async (req, res) => {
    // Take email, password
    console.log("LOGIN, req.body: ", req.body)
    const { email, password } = req.body
    try {
        // Verify email in database
        const user = await User.findOne({ email: email })
        if(!user) {
        console.log("404 Response: " + 'User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        // Verify password
        const verifyPassword = await bcrypt.compare(password, user.password)
        if(!verifyPassword) {
            console.log("401 Response: " + 'Incorrect password');
            return res.status(401).json({ message: 'Incorrect password' });
        }
        // Creates token and set it in httpOnlyCookies
        createAndSetTokenInCookies(user, res)
        
        res.status(200).json({ 
            userId: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            role: user.role,
            friendList: user.friends || []
        });
    } catch (error) {
        console.log("500 Response: " + 'Login error: ' + error.message);
        res.status(500).json({ message: 'Login error', error: error.message });
    }
}

// POST api/auth/logOut
export const logout = async (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
    });

    res.status(200).json({ message: 'Logged out successfully' });
}

// GET api/auth/checkLoggedIn
// Note: router.get('/checkLoggedIn', authMiddleware, checkLoggedin)
export const checkLoggedin = async (req, res) => {
    console.log('checkLoggedin called, ')
    const user = req.user
    if(!user) {
        console.log('checkLoggedin called, isLoggedIn: false')
        return res.status(200).json({ isLoggedIn: false });
    }
    console.log('checkLoggedin called, isLoggedIn: false')
    try {
        const userFromDatabase = await User.findById(user.id)
        return res.status(200).json({ isLoggedIn: true, userId: user.id, username: userFromDatabase.username, profilePicture: userFromDatabase.profilePicture, role: userFromDatabase.role, friendList: userFromDatabase.friends });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}