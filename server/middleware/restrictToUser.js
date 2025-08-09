import User from '../models/User.js';
const restrictTouser = (req, res, next) => {
    const role = req.user.role
    if(!role === 'user') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' }); 
    }
    next()
}
export default restrictTouser