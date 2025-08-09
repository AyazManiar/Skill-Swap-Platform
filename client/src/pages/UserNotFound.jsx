import './UserNotFound.css';
import { useNavigate } from 'react-router';
const UserNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="user-notfound-container">
      <div className="user-notfound-content">
        <div className="user-notfound-illustration">
          <div className="magnifying-glass">
            <div className="glass-lens">
              <div className="reflection"></div>
            </div>
            <div className="glass-handle"></div>
          </div>
          <div className="search-area">
            <div className="empty-profile">
              <div className="profile-placeholder">
                <div className="profile-icon">👤</div>
              </div>
              <div className="profile-lines">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
              </div>
            </div>
            <div className="floating-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
              <div className="dot dot-4"></div>
              <div className="dot dot-5"></div>
            </div>
          </div>
        </div>
        <div className="user-notfound-text">
          <h1 className="user-notfound-title">User Not Found</h1>
          <p className="user-notfound-message">
            We couldn't locate the user you're looking for.
          </p>
          <p className="user-notfound-submessage">
            The profile might have been removed, deactivated, or the username is incorrect.
          </p>
          <div className="user-notfound-actions">
            <button 
              onClick={() => navigate('/')} 
              className="user-notfound-button primary"
            >
              Browse Users
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="user-notfound-button secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserNotFound;
