import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        console.log('Auth Middleware, Token not found')
        return res.status(200).json({ isLoggedIn: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('Auth Middleware, user not loggedin')
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        console.log('Auth Middleware, Passed, req.user:', decoded)
        req.user = decoded
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token or user lookup failed' });
    }
};
export default authMiddleware;
