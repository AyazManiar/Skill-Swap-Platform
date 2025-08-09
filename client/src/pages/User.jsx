import './User.css';
import { useParams, useNavigate } from "react-router";
import { useEffect, useState, Suspense, lazy, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import defaultProfile from '../assets/icons/defaultProfile.jpg';
const UserNotFound = lazy(() => import('./UserNotFound.jsx'));
const baseURL = import.meta.env.VITE_API_BASE_URL;
const User = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [userFound, setUserFound] = useState(null); 
  const [userData, setUserData] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (auth.isLoggedIn && auth.username === username) {
      navigate('/my-profile');
      return;
    }
    const fetchUser = async () => {
      try {
        const encodedUsername = encodeURIComponent(username);
        const response = await fetch(`${baseURL}/api/users/${encodedUsername}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        console.log(data);
        setUserFound(data.found);
        if (data.found && data.user) {
          setUserData(data.user);
          setIsFriend(data.isFriend || false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserFound(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username, auth.isLoggedIn, auth.username, navigate]);
  if (loading) return <div className="loading">Loading...</div>;
  if (!userFound) {
    return (
      <Suspense fallback={<div>Loading user not found page...</div>}>
        <UserNotFound />
      </Suspense>
    );
  }
  return (
    <div className="User">
      <div className="user-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
      <div className="user-profile">
        <div className="profile-main">
          <div className="profile-picture">
            <img src={defaultProfile} alt={`${userData?.username}'s profile`} />
          </div>
          <div className="profile-info">
            <div className="profile-header">
              <h1>{userData?.username}</h1>
              {auth.isLoggedIn && auth.username !== userData?.username && (
                <div className="profile-actions">
                  <button className={`friend-button ${isFriend ? 'friend' : 'add-friend'}`}>
                    {isFriend ? 'Friends' : 'Add Friend'}
                  </button>
                  <button className="request-button">Send Swap Request</button>
                </div>
              )}
            </div>
            <div className="profile-bio">
              <p>{userData?.bio || 'No bio available'}</p>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-label">Rating:</span>
                <span className="stat-value">
                  {'⭐'.repeat(Math.round(userData?.averageRating || 0)) || '—'}
                  <span className="rating-count">({userData?.reviewCount || 0} reviews)</span>
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Availability:</span>
                <span className="stat-value">
                  {userData?.availability?.join(', ') || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-skills">
          <div className="skills-section">
            <h3>Skills Offered</h3>
            <div className="skills-container">
              {userData?.skills?.length > 0 ? (
                userData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag offered">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No skills listed</p>
              )}
            </div>
          </div>
          <div className="skills-section">
            <h3>Skills Wanted</h3>
            <div className="skills-container">
              {userData?.skillsWanted?.length > 0 ? (
                userData.skillsWanted.map((skill, index) => (
                  <span key={index} className="skill-tag wanted">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No skills wanted listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default User;
