import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique:true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    profilePicture: { type: String, default: 'default.jpg' },
    bio: { type: String, default: '' },
    availability: { 
        type: [String], 
        enum: [
            "Always", "Occasionally", "Monthly", "Biweekly", "Weekly", "One-time",
            "Weekdays", "Weekends",
            "Early Mornings", "Mornings", "Afternoons", "Evenings", "Nights", "Late Nights",
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
            "Specific Hours", "Flexible", "By Appointment", "Unavailable Temporarily"
        ],
        default: ['Always']
    },
    isPublic: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendsRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendsRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    skills: [String],
    skillsWanted: { type: [String], default: [] },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },

    swapRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' }],
    swapRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' }],

    createdAt: { type: Date, default: Date.now }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model('User', userSchema)