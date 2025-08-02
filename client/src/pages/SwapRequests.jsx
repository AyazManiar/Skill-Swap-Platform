import './SwapRequests.css';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import FeedbackModal from '../components/FeedbackModal';
import ViewFeedbackModal from '../components/ViewFeedbackModal';
import { toastError, toastSuccess } from '../lib/useToast';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const SwapRequests = () => {
  const { auth } = useContext(AuthContext);
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing'); // ongoing, outgoing, incoming, completed
  
  // Feedback modal states
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    swapRequest: null,
    targetUser: null
  });
  
  const [viewFeedbackModal, setViewFeedbackModal] = useState({
    isOpen: false,
    feedback: null,
    targetUser: null
  });
  
  // Track feedback status for each completed request
  const [feedbackStatus, setFeedbackStatus] = useState({});

  // Filter requests based on status and direction
  const ongoingRequests = swapRequests.filter(req => 
    req.status === 'accepted' || req.status === 'completion_requested'
  );
  
  const outgoingRequests = swapRequests.filter(req => 
    req.status === 'pending' && req.fromUser._id === auth.userId
  );
  
  const incomingRequests = swapRequests.filter(req => 
    req.status === 'pending' && req.toUser._id === auth.userId
  );
  
  const completedRequests = swapRequests.filter(req => 
    req.status === 'completed' || req.status === 'rejected'
  );

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/api/swapRequests`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch swap requests');
      }

      const data = await response.json();
      setSwapRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await fetch(`${baseURL}/api/swapRequests/${requestId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchSwapRequests(); // Refresh the list
        toastSuccess('Swap request cancelled successfully!');
      } else {
        const errorData = await response.json();
        toastError(errorData.message || 'Failed to cancel request');
      }
    } catch (error) {
      toastError('Error cancelling request: ' + error.message);
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${baseURL}/api/swapRequests/action`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swapRequestId: requestId,
          action: 'accepted'
        }),
      });

      if (response.ok) {
        fetchSwapRequests(); // Refresh the list
        toastSuccess('Swap request accepted!');
      } else {
        const errorData = await response.json();
        toastError(errorData.message || 'Failed to accept request');
      }
    } catch (error) {
      toastError('Error accepting request: ' + error.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`${baseURL}/api/swapRequests/action`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swapRequestId: requestId,
          action: 'rejected'
        }),
      });

      if (response.ok) {
        fetchSwapRequests(); // Refresh the list
        toastSuccess('Swap request rejected!');
      } else {
        const errorData = await response.json();
        toastError(errorData.message || 'Failed to reject request');
      }
    } catch (error) {
      toastError('Error rejecting request: ' + error.message);
    }
  };

  const handleRequestCompletion = async (requestId) => {
    try {
      const response = await fetch(`${baseURL}/api/swapRequests/complete/${requestId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchSwapRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error requesting completion:', error);
    }
  };

  const handleConfirmCompletion = async (requestId) => {
    try {
      const response = await fetch(`${baseURL}/api/swapRequests/complete-confirm/${requestId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchSwapRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error confirming completion:', error);
    }
  };

  // Check if feedback has been given for a swap request
  const checkFeedbackStatus = async (swapRequestId) => {
    try {
      const response = await fetch(`${baseURL}/api/feedback/check/${swapRequestId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbackStatus(prev => ({
          ...prev,
          [swapRequestId]: data
        }));
      }
    } catch (error) {
      console.error('Error checking feedback status:', error);
    }
  };

  // Load feedback status for completed requests
  useEffect(() => {
    completedRequests.forEach(request => {
      if (request.status === 'completed') {
        checkFeedbackStatus(request._id);
      }
    });
  }, [swapRequests]);

  const handleGiveFeedback = (swapRequest, targetUser) => {
    setFeedbackModal({
      isOpen: true,
      swapRequest,
      targetUser
    });
  };

  const handleViewFeedback = (swapRequest, targetUser) => {
    const feedback = feedbackStatus[swapRequest._id]?.feedback;
    setViewFeedbackModal({
      isOpen: true,
      feedback,
      targetUser
    });
  };

  const handleFeedbackSubmitted = (feedback) => {
    // Update feedback status
    setFeedbackStatus(prev => ({
      ...prev,
      [feedback.swapRequest]: {
        feedbackGiven: true,
        feedback
      }
    }));
    toastSuccess('Feedback submitted successfully!');
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      swapRequest: null,
      targetUser: null
    });
  };

  const closeViewFeedbackModal = () => {
    setViewFeedbackModal({
      isOpen: false,
      feedback: null,
      targetUser: null
    });
  };

  const renderSwapRequestCard = (request) => {
    const isFromCurrentUser = request.fromUser._id === auth.userId;
    const otherUser = isFromCurrentUser ? request.toUser : request.fromUser;

    return (
      <div key={request._id} className="swap-request-card">
        <div className="request-header">
          <div className="user-info">
            <h3>{otherUser.username}</h3>
            <span className={`status-badge ${request.status}`}>
              {request.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="request-meta">
            <div className="request-direction">
              {isFromCurrentUser ? (
                <span className="direction-info">Sent to: <strong>{request.toUser.username}</strong></span>
              ) : (
                <span className="direction-info">Received from: <strong>{request.fromUser.username}</strong></span>
              )}
            </div>
            <div className="request-date">
              Created: {new Date(request.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div className="request-body">
          <div className="skills-section">
            <div className="offered-skills">
              <h4>Skills Offered:</h4>
              <div className="skills-tags">
                {request.offeredSkills.map((skill, index) => (
                  <span key={index} className="skill-tag offered">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="requested-skills">
              <h4>Skills Requested:</h4>
              <div className="skills-tags">
                {request.requestedSkills.map((skill, index) => (
                  <span key={index} className="skill-tag requested">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {request.note && (
            <div className="request-note">
              <h4>Note:</h4>
              <p>{request.note}</p>
            </div>
          )}
        </div>

        <div className="request-actions">
          {request.status === 'pending' && !isFromCurrentUser && (
            <>
              <button 
                className="accept-btn"
                onClick={() => handleAcceptRequest(request._id)}
              >
                Accept
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleRejectRequest(request._id)}
              >
                Reject
              </button>
            </>
          )}

          {request.status === 'pending' && isFromCurrentUser && (
            <div className="pending-status">
              <span className="waiting-text">Waiting for response...</span>
              <span className="cancel-request" onClick={() => handleCancelRequest(request._id)}>Cancel Request</span>
            </div>
          )}

          {request.status === 'accepted' && (
            <button 
              className="complete-btn"
              onClick={() => handleRequestCompletion(request._id)}
            >
              Request Completion
            </button>
          )}

          {request.status === 'completion_requested' && 
           request.completion_request_received_by === auth.userId && (
            <button 
              className="confirm-btn"
              onClick={() => handleConfirmCompletion(request._id)}
            >
              Confirm Completion
            </button>
          )}

          {request.status === 'completion_requested' && 
           request.completion_request_sent_by === auth.userId && (
            <div className="completion-status">
              <span className="waiting-text">Waiting for completion confirmation...</span>
            </div>
          )}

          {request.status === 'completed' && (
            <div className="feedback-actions">
              {(() => {
                const isFromCurrentUser = request.fromUser._id === auth.userId;
                const otherUser = isFromCurrentUser ? request.toUser : request.fromUser;
                const status = feedbackStatus[request._id];
                
                if (status?.feedbackGiven) {
                  return (
                    <button 
                      className="view-feedback-btn"
                      onClick={() => handleViewFeedback(request, otherUser)}
                    >
                      View Feedback
                    </button>
                  );
                } else {
                  return (
                    <button 
                      className="give-feedback-btn"
                      onClick={() => handleGiveFeedback(request, otherUser)}
                    >
                      Give Feedback
                    </button>
                  );
                }
              })()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    let requestsToShow = [];
    
    switch (activeTab) {
      case 'ongoing':
        requestsToShow = ongoingRequests;
        break;
      case 'outgoing':
        requestsToShow = outgoingRequests;
        break;
      case 'incoming':
        requestsToShow = incomingRequests;
        break;
      case 'completed':
        requestsToShow = completedRequests;
        break;
      default:
        requestsToShow = [];
    }

    if (requestsToShow.length === 0) {
      return (
        <div className="no-requests">
          <p>No {activeTab} requests found.</p>
        </div>
      );
    }

    return (
      <div className="requests-list">
        {requestsToShow.map(renderSwapRequestCard)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="SwapRequests">
        <Navbar />
        <div className="swap-requests-container">
          <div className="loading">Loading swap requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="SwapRequests">
        <Navbar />
        <div className="swap-requests-container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='SwapRequests'>
      <Navbar />
      <div className="swap-requests-container">
        <div className="page-header">
          <h1>Swap Requests</h1>
          <div className="requests-summary">
            <span>Total: {swapRequests.length}</span>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing ({ongoingRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('outgoing')}
            >
              Outgoing ({outgoingRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming ({incomingRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({completedRequests.length})
            </button>
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={closeFeedbackModal}
        swapRequest={feedbackModal.swapRequest}
        targetUser={feedbackModal.targetUser}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />

      <ViewFeedbackModal
        isOpen={viewFeedbackModal.isOpen}
        onClose={closeViewFeedbackModal}
        feedback={viewFeedbackModal.feedback}
        targetUser={viewFeedbackModal.targetUser}
      />
    </div>
  );
};

export default SwapRequests;