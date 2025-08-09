import { useState } from 'react';
import './FeedbackModal.css';
const FeedbackModal = ({ isOpen, onClose, swapRequest, targetUser, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${baseURL}/api/feedback/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          swapRequestId: swapRequest._id,
          targetUserId: targetUser._id,
          rating,
          comment: comment.trim() || undefined
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }
      const data = await response.json();
      onFeedbackSubmitted(data.feedback);
      handleClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    setRating(0);
    setComment('');
    setHoveredRating(0);
    setError('');
    onClose();
  };
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
      >
        ★
      </button>
    ));
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="feedback-modal">
        <div className="modal-header">
          <h2>Give Feedback</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="feedback-info">
            <p>How was your skill swap experience with <strong>{targetUser.username}</strong>?</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="rating-section">
              <label>Rating *</label>
              <div className="star-rating">
                {renderStars()}
              </div>
              <div className="rating-text">
                {rating > 0 && (
                  <span>
                    {rating} star{rating !== 1 ? 's' : ''} - 
                    {rating === 1 && ' Poor'}
                    {rating === 2 && ' Fair'}
                    {rating === 3 && ' Good'}
                    {rating === 4 && ' Very Good'}
                    {rating === 5 && ' Excellent'}
                  </span>
                )}
              </div>
            </div>
            <div className="comment-section">
              <label htmlFor="comment">Comment (Optional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this skill swap..."
                maxLength={500}
                rows={4}
              />
              <small>{comment.length}/500 characters</small>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={handleClose} className="cancel-btn">
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FeedbackModal;
