import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import defaultProfile from '../assets/icons/defaultProfile.jpg';
import './FriendList.css';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FriendList = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${baseURL}/api/users/friends`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError("Failed to load friends list");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <div className="loading">Loading friends...</div>;

  if (error) {
    return (
      <div className="friend-list-container">
        <div className="friend-list-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>My Friends</h1>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="friend-list-container">
      <div className="friend-list-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>My Friends</h1>
        <p className="friends-count">
          {friends.length === 0 
            ? "You have no friends yet" 
            : `${friends.length} friend${friends.length > 1 ? 's' : ''}`
          }
        </p>
      </div>

      {friends.length === 0 ? (
        <div className="no-friends">
          <p>You haven't added any friends yet.</p>
          <Link to="/" className="explore-link">
            Explore users to add friends
          </Link>
        </div>
      ) : (
        <div className="friends-grid">
          {friends.map((friend) => (
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
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
