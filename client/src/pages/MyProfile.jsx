import './MyProfile.css';
import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import defaultProfile from '../assets/icons/defaultProfile.jpg';
import EditProfileModal from '../components/EditProfileModal';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const MyProfile = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await fetch(`${baseURL}/api/users/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfileData(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProfile();
  }, []);
  const handleUpdateProfile = () => {
    setIsEditModalOpen(true);
  };
  const handleProfileUpdated = (updatedData) => {
    setProfileData(updatedData);
    setIsEditModalOpen(false);
  };
  if (loading) return <div className="loading">Loading your profile...</div>;
  if (error) return <div className="error">{error}</div>;
  return (
    <div className="MyProfile">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>My Profile</h1>
      </div>
      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-picture-section">
            <img 
              src={profileData?.profilePicture === "default.jpg" || !profileData?.profilePicture 
                ? defaultProfile 
                : profileData.profilePicture} 
              alt="Your profile" 
              className="profile-picture"
            />
            <div className="profile-actions">
              <button className="update-button primary" onClick={handleUpdateProfile}>
                Edit Profile
              </button>
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-header-info">
              <h2>{profileData?.username}</h2>
              <div className="profile-badges">
                <span className={`visibility-badge ${profileData?.isPublic ? 'public' : 'private'}`}>
                  {profileData?.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
                <span className="role-badge">
                  {profileData?.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
            </div>
            <div className="profile-bio">
              <h3>Bio</h3>
              <p>{profileData?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">
                    {profileData?.averageRating?.toFixed(1) || '—'}
                    <span className="rating-count">({profileData?.reviewCount || 0} reviews)</span>
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <span className="stat-label">Availability</span>
                  <span className="stat-value">
                    {profileData?.availability?.length > 0 
                      ? profileData.availability.join(', ') 
                      : 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <span className="stat-label">Friends</span>
                  <span className="stat-value">
                    {profileData?.friends?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="skills-section">
          <div className="skills-container">
            <div className="skills-category">
              <h3>Skills I Offer</h3>
              <div className="skills-list">
                {profileData?.skills?.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag offered">{skill}</span>
                  ))
                ) : (
                  <p className="no-skills">No skills listed. Add some in your profile!</p>
                )}
              </div>
            </div>
            <div className="skills-category">
              <h3>Skills I Want to Learn</h3>
              <div className="skills-list">
                {profileData?.skillsWanted?.length > 0 ? (
                  profileData.skillsWanted.map((skill, index) => (
                    <span key={index} className="skill-tag wanted">{skill}</span>
                  ))
                ) : (
                  <p className="no-skills">No skills wanted listed. Add some in your profile!</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="account-settings">
          <h3>Account Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="setting-label">Email:</span>
              <span className="setting-value">{profileData?.email}</span>
            </div>
            <div className="setting-item">
              <span className="setting-label">Member since:</span>
              <span className="setting-value">
                {new Date(profileData?.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="setting-item">
              <span className="setting-label">Profile visibility:</span>
              <span className="setting-value">
                {profileData?.isPublic ? 'Public (visible to everyone)' : 'Private (visible to friends only)'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
          currentData={profileData}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};
export default MyProfile;
