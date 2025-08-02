import React from 'react';
import './ViewFeedbackModal.css';

const ViewFeedbackModal = ({ isOpen, onClose, feedback, targetUser }) => {
  if (!isOpen) return null;

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="view-feedback-modal">
        <div className="modal-header">
          <h2>Your Feedback</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="feedback-display">
            <div className="feedback-target">
              <p>Your feedback for <strong>{targetUser.username}</strong></p>
            </div>

            <div className="rating-display">
              <label>Rating</label>
              <div className="star-rating">
                {renderStars(feedback.rating)}
              </div>
              <div className="rating-text">
                {feedback.rating} star{feedback.rating !== 1 ? 's' : ''} - {getRatingText(feedback.rating)}
              </div>
            </div>

            {feedback.comment && (
              <div className="comment-display">
                <label>Your Comment</label>
                <div className="comment-text">
                  {feedback.comment}
                </div>
              </div>
            )}

            <div className="feedback-date">
              <small>
                Submitted on: {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFeedbackModal;
