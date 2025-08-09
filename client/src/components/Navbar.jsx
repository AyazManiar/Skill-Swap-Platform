import "./Navbar.css";
import { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import defaultProfilePicture from "../assets/icons/defaultProfile.jpg";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profilePicture = auth.profilePicture === "default.jpg" || !auth.profilePicture 
    ? defaultProfilePicture 
    : auth.profilePicture;
  const location = useLocation();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    navigate('/my-profile');
  };
  const handleViewFriends = () => {
    setIsDropdownOpen(false);
    navigate('/friends');
  }
  const handleLogout =  () => {
    setIsDropdownOpen(false);
    logout()
    navigate('/');
  };
  return (
    <div className="Navbar">
      <h1>Skill Swap</h1>
      <div className="right">
        <div className="nav-links">
          {
            location.pathname === '/' ? (
              <Link to="/swap-requests">Swap Requests</Link>
            ) : (
              <Link to="/">Home</Link>
            )
          }
        </div>
        <div className="login-button">
          {auth.isLoggedIn ? (
            <div className="user-profile-container" ref={dropdownRef}>
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="profile-picture" 
                onClick={handleProfileClick}
              />
              <div className="profile-tooltip">{auth.username}</div>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-item" onClick={handleViewProfile}>
                    <span>View Profile</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleViewFriends}>
                    <span>See Friends</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
