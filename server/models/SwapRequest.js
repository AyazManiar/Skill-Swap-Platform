import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkills: { type: [String], required: true },
  requestedSkills: { type: [String], required: true },
  note: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'cancelled', 'accepted', 'rejected', 'completion_requested', 'completed'],
    default: 'pending'
  },
  completion_request_sent: { type: Boolean, default: false },
  completion_request_sent_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completion_request_received_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Middleware to update user swap request lists
swapRequestSchema.post('save', async function (doc, next) {
  try {
    const { fromUser, toUser, _id } = doc;

    // Add to sender's sent list
    await mongoose.model('User').findByIdAndUpdate(fromUser, {
      $addToSet: { swapRequestsSent: _id }
    });

    // Add to receiver's received list
    await mongoose.model('User').findByIdAndUpdate(toUser, {
      $addToSet: { swapRequestsReceived: _id }
    });

    next();
  } catch (err) {
    next(err);
  }
});

// Middleware to remove swap request from user lists on deletion
swapRequestSchema.post('findOneAndDelete', async function (doc, next) {
  if (!doc) return next();

  const { fromUser, toUser, _id } = doc;

  try {
    await mongoose.model('User').findByIdAndUpdate(fromUser, {
      $pull: { swapRequestsSent: _id }
    });

    await mongoose.model('User').findByIdAndUpdate(toUser, {
      $pull: { swapRequestsReceived: _id }
    });

    next();
  } catch (err) {
    next(err);
  }
});


export default mongoose.model('SwapRequest', swapRequestSchema);
