import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});
feedbackSchema.index({ swapRequest: 1, user: 1 }, { unique: true });
feedbackSchema.post('save', async function (doc, next) {
  try {
    const { targetUser } = doc;
    const feedbacks = await mongoose.model('Feedback').find({ targetUser });
    const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const avg = total / feedbacks.length;
    await mongoose.model('User').findByIdAndUpdate(targetUser, {
      averageRating: avg,
      reviewCount: feedbacks.length
    });
    next();
  } catch (err) {
    next(err);
  }
});
export default mongoose.model('Feedback', feedbackSchema);