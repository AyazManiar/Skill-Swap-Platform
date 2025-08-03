import './SwapRequestModal.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toastSuccess, toastError } from "../lib/useToast"

const SwapRequestModal = ({ isOpen, onClose, recipientUsername, recipientId, onSendRequest }) => {
  const [offeredInput, setOfferedInput] = useState('');
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [requestedInput, setRequestedInput] = useState('');
  const [requestedSkills, setRequestedSkills] = useState([]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const addOfferedSkill = () => {
    if (offeredInput.trim() && !offeredSkills.includes(offeredInput.trim())) {
      setOfferedSkills([...offeredSkills, offeredInput.trim()]);
      setOfferedInput('');
    }
  };
  const removeOfferedSkill = (skillToRemove) => {
    setOfferedSkills(offeredSkills.filter(skill => skill !== skillToRemove));
  };

  const addRequestedSkill = () => {
    if (requestedInput.trim() && !requestedSkills.includes(requestedInput.trim())) {
      setRequestedSkills([...requestedSkills, requestedInput.trim()]);
      setRequestedInput('');
    }
  };
  const removeRequestedSkill = (skillToRemove) => {
    setRequestedSkills(requestedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'offered') {
        addOfferedSkill();
      } else {
        addRequestedSkill();
      }
    }
  };
  const handleSubmit = async () => {
    if (offeredSkills.length === 0 || requestedSkills.length === 0) {
      alert('Please add at least one skill to offer and one skill to request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSendRequest({
        toUser: recipientId,
        offeredSkills,
        requestedSkills,
        note
      });
      
      // Reset form
      setOfferedSkills([]);
      setRequestedSkills([]);
      setOfferedInput('');
      setRequestedInput('');
      setNote('');
      onClose();
    } catch (error) {
      console.error('Error sending swap request:', error);
      toastError('Failed to send swap request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setOfferedSkills([]);
    setRequestedSkills([]);
    setOfferedInput('');
    setRequestedInput('');
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="Swap-request-modal-overlay" onClick={handleClose}>
      <div className="Swap-request-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="Swap-request-modal-header">
          <h2>Send Swap Request to {recipientUsername}</h2>
          <button className="Swap-request-close-button" onClick={handleClose}>×</button>
        </div>

        <div className="Swap-request-modal-body">
          <div className="Swap-request-skills-section">
            <label>Skills I Can Offer:</label>
            <div className="Swap-request-skill-input-container">
              <input
                type="text"
                value={offeredInput}
                onChange={(e) => setOfferedInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 'offered')}
                placeholder="Type a skill and press Enter"
                className="Swap-request-skill-input"
              />
              <button 
                type="button" 
                onClick={addOfferedSkill}
                className="Swap-request-add-skill-btn"
              >
                Add
              </button>
            </div>
            <div className="Swap-request-skills-tags">
              {offeredSkills.map((skill, index) => (
                <span key={index} className="Swap-request-skill-tag offered">
                  {skill}
                  <button 
                    onClick={() => removeOfferedSkill(skill)}
                    className="Swap-request-remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="Swap-request-skills-section">
            <label>Skills I Want to Learn:</label>
            <div className="Swap-request-skill-input-container">
              <input
                type="text"
                value={requestedInput}
                onChange={(e) => setRequestedInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 'requested')}
                placeholder="Type a skill and press Enter"
                className="Swap-request-skill-input"
              />
              <button 
                type="button" 
                onClick={addRequestedSkill}
                className="Swap-request-add-skill-btn"
              >
                Add
              </button>
            </div>
            <div className="Swap-request-skills-tags">
              {requestedSkills.map((skill, index) => (
                <span key={index} className="Swap-request-skill-tag requested">
                  {skill}
                  <button 
                    onClick={() => removeRequestedSkill(skill)}
                    className="Swap-request-remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="Swap-request-note-section">
            <label>Additional Note (Optional):</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional message or details..."
              className="Swap-request-note-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="Swap-request-modal-footer">
          <button 
            className="Swap-request-cancel-btn" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="Swap-request-send-btn" 
            onClick={handleSubmit}
            disabled={isSubmitting || offeredSkills.length === 0 || requestedSkills.length === 0}
          >
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SwapRequestModal;
