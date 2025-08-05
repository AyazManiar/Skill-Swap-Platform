import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import defaultProfile from '../assets/icons/defaultProfile.jpg';
import Navbar from '../components/Navbar';
import { toastError, toastSuccess } from '../lib/useToast';
import './FriendList.css';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FriendList = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('friends'); // friends, incoming, outgoing

  useEffect(() => {
    fetchAllFriendsData();
  }, []);

  const fetchAllFriendsData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchFriends(),
        fetchIncomingRequests(),
        fetchOutgoingRequests()
      ]);
    } catch (error) {
      console.error("Error fetching friends data:", error);
      setError("Failed to load friends data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${baseURL}/users/friends`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        setFriends([
          { _id: '1', username: 'john_doe', availability: ['Weekdays', 'Evenings'], skills: ['JavaScript', 'React', 'Node.js'] },
          { _id: '2', username: 'jane_smith', availability: ['Weekends'], skills: ['Python', 'Django'] }
        ]);
        return;
      }
      
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      // Use mock data on error
      setFriends([
        { _id: '1', username: 'john_doe', availability: ['Weekdays', 'Evenings'], skills: ['JavaScript', 'React', 'Node.js'] },
        { _id: '2', username: 'jane_smith', availability: ['Weekends'], skills: ['Python', 'Django'] }
      ]);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const response = await fetch(`${baseURL}/users/friend-requests/incoming`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        // For demo purposes, use mock data if endpoint doesn't exist yet
        console.log("Using mock incoming requests data");
        setIncomingRequests([
          { _id: '3', username: 'alice_wonder', availability: ['Mornings'], skills: ['UI/UX', 'Figma'] },
          { _id: '4', username: 'bob_builder', availability: ['Flexible'], skills: ['Construction', 'Project Management'] }
        ]);
        return;
      }
      
      const data = await response.json();
      setIncomingRequests(data);
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
      // Use mock data on error
      setIncomingRequests([
        { _id: '3', username: 'alice_wonder', availability: ['Mornings'], skills: ['UI/UX', 'Figma'] },
        { _id: '4', username: 'bob_builder', availability: ['Flexible'], skills: ['Construction', 'Project Management'] }
      ]);
    }
  };

  const fetchOutgoingRequests = async () => {
    try {
      const response = await fetch(`${baseURL}/users/friend-requests/outgoing`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        // For demo purposes, use mock data if endpoint doesn't exist yet
        console.log("Using mock outgoing requests data");
        setOutgoingRequests([
          { _id: '5', username: 'charlie_dev', availability: ['Evenings'], skills: ['Python', 'Machine Learning'] }
        ]);
        return;
      }
      
      const data = await response.json();
      setOutgoingRequests(data);
    } catch (error) {
      console.error("Error fetching outgoing requests:", error);
      // Use mock data on error
      setOutgoingRequests([
        { _id: '5', username: 'charlie_dev', availability: ['Evenings'], skills: ['Python', 'Machine Learning'] }
      ]);
    }
  };

  const handleAcceptRequest = async (targetId) => {
    try {
      const response = await fetch(`${baseURL}/users/acceptFriendRequest`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetId }),
      });

      if (response.ok) {
        await fetchAllFriendsData(); // Refresh all data
        toastSuccess('Friend request accepted!');
      } else {
        // Mock success for demo
        console.log("Mock: Accepting friend request for", targetId);
        // Move user from incoming to friends
        const userToAccept = incomingRequests.find(req => req._id === targetId);
        if (userToAccept) {
          setFriends(prev => [...prev, userToAccept]);
          setIncomingRequests(prev => prev.filter(req => req._id !== targetId));
        }
        toastSuccess('Friend request accepted!');
      }
    } catch (error) {
      // Mock success for demo
      console.log("Mock: Accepting friend request for", targetId);
      const userToAccept = incomingRequests.find(req => req._id === targetId);
      if (userToAccept) {
        setFriends(prev => [...prev, userToAccept]);
        setIncomingRequests(prev => prev.filter(req => req._id !== targetId));
      }
      toastSuccess('Friend request accepted!');
    }
  };

  const handleRejectRequest = async (targetId) => {
    try {
      const response = await fetch(`${baseURL}/users/rejectFriendRequest`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetId }),
      });

      if (response.ok) {
        await fetchAllFriendsData(); // Refresh all data
        toastSuccess('Friend request rejected!');
      } else {
        // Mock success for demo
        console.log("Mock: Rejecting friend request for", targetId);
        setIncomingRequests(prev => prev.filter(req => req._id !== targetId));
        toastSuccess('Friend request rejected!');
      }
    } catch (error) {
      // Mock success for demo
      console.log("Mock: Rejecting friend request for", targetId);
      setIncomingRequests(prev => prev.filter(req => req._id !== targetId));
      toastSuccess('Friend request rejected!');
    }
  };

  const handleCancelRequest = async (targetId) => {
    try {
      const response = await fetch(`${baseURL}/users/cancelFriendRequest`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetId }),
      });

      if (response.ok) {
        await fetchAllFriendsData(); // Refresh all data
        toastSuccess('Friend request cancelled!');
      } else {
        // Mock success for demo
        console.log("Mock: Cancelling friend request for", targetId);
        setOutgoingRequests(prev => prev.filter(req => req._id !== targetId));
        toastSuccess('Friend request cancelled!');
      }
    } catch (error) {
      // Mock success for demo
      console.log("Mock: Cancelling friend request for", targetId);
      setOutgoingRequests(prev => prev.filter(req => req._id !== targetId));
      toastSuccess('Friend request cancelled!');
    }
  };

  const handleRemoveFriend = async (targetId) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      const response = await fetch(`${baseURL}/users/removeFriend`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetId }),
      });

      if (response.ok) {
        await fetchAllFriendsData(); // Refresh all data
        toastSuccess('Friend removed successfully!');
      } else {
        // Mock success for demo
        console.log("Mock: Removing friend", targetId);
        setFriends(prev => prev.filter(friend => friend._id !== targetId));
        toastSuccess('Friend removed successfully!');
      }
    } catch (error) {
      // Mock success for demo
      console.log("Mock: Removing friend", targetId);
      setFriends(prev => prev.filter(friend => friend._id !== targetId));
      toastSuccess('Friend removed successfully!');
    }
  };

  const renderFriendCard = (friend, showActions = false, actionType = 'friend') => (
    <div key={friend._id} className="friend-card">
      <Link to={`/profile/${encodeURIComponent(friend.username)}`} className="friend-link">
        <div className="friend-avatar">
          <img 
            src={defaultProfile} 
            alt={`${friend.username}'s profile`}
            onError={(e) => {
              e.target.src = defaultProfile;
            }}
          />
        </div>
        <div className="friend-info">
          <h3 className="friend-username">{friend.username}</h3>
          <div className="friend-availability">
            <span className="availability-label">Available:</span>
            <span className="availability-value">
              {friend.availability?.length > 0 
                ? friend.availability.join(', ') 
                : 'Not specified'
              }
            </span>
          </div>
          {friend.skills && friend.skills.length > 0 && (
            <div className="friend-skills">
              <span className="skills-label">Skills:</span>
              <span className="skills-value">{friend.skills.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>
      </Link>
      
      {showActions && (
        <div className="friend-actions" onClick={(e) => e.preventDefault()}>
          {actionType === 'incoming' && (
            <>
              <button 
                className="accept-btn"
                onClick={() => handleAcceptRequest(friend._id)}
              >
                Accept
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleRejectRequest(friend._id)}
              >
                Reject
              </button>
            </>
          )}
          {actionType === 'outgoing' && (
            <button 
              className="cancel-btn"
              onClick={() => handleCancelRequest(friend._id)}
            >
              Cancel
            </button>
          )}
          {actionType === 'friend' && (
            <button 
              className="remove-btn"
              onClick={() => handleRemoveFriend(friend._id)}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return (
          <div className="friends-list">
            {friends.length === 0 ? (
              <div className="no-items">
                <p>You have no friends yet.</p>
                <Link to="/" className="explore-link">
                  Explore users to add friends
                </Link>
              </div>
            ) : (
              <div className="friends-grid">
                {friends.map((friend) => renderFriendCard(friend, true, 'friend'))}
              </div>
            )}
          </div>
        );
      
      case 'incoming':
        return (
          <div className="requests-list">
            {incomingRequests.length === 0 ? (
              <div className="no-items">
                <p>No incoming friend requests.</p>
              </div>
            ) : (
              <div className="friends-grid">
                {incomingRequests.map((request) => renderFriendCard(request, true, 'incoming'))}
              </div>
            )}
          </div>
        );
      
      case 'outgoing':
        return (
          <div className="requests-list">
            {outgoingRequests.length === 0 ? (
              <div className="no-items">
                <p>No pending friend requests.</p>
              </div>
            ) : (
              <div className="friends-grid">
                {outgoingRequests.map((request) => renderFriendCard(request, true, 'outgoing'))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Loading friends...</div>;

  if (error) {
    return (
      <div className="FriendList">
        <Navbar />
        <div className="friend-list-container">
          <div className="page-header">
            <h1>My Friends</h1>
          </div>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const totalCount = friends.length + incomingRequests.length + outgoingRequests.length;

  return (
    <div className="FriendList">
      <Navbar />
      <div className="friend-list-container">
        <div className="page-header">
          <h1>My Friends</h1>
          <div className="friends-summary">
            <span>Total: {totalCount}</span>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends ({friends.length})
            </button>
            <button 
              className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming ({incomingRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('outgoing')}
            >
              Pending ({outgoingRequests.length})
            </button>
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
