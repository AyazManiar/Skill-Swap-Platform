import "./ProfileCard.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import defaultPhoto from "../assets/icons/defaultProfile.jpg";
import SwapRequestModal from "./SwapRequestModal";
import { toastSuccess, toastError } from '../lib/useToast';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const ProfileCard = (props) => {
  const {
    userId,
    username,
    availability,
    skills = [],
    skillsWanted = [],
    averageRating = 0,
    reviewCount = 0,
    isFriend,
  } = props;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const sendSwapRequest = async (requestData) => {
    try {
      const res = await fetch(`${baseURL}/api/swapRequests/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send swap request");
      }

      const data = await res.json();
      toastSuccess("Swap request sent successfully!");
      return data;
    } catch (error) {
      toastError("Error sending swap request:", error);
      throw error;
    }
  };

  const handleSwapRequestClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="ProfileCard">
      <div className="info">
        <div className="profilePhoto">
          {/* Profile Picture Code: Remaining */}
          <img src={defaultPhoto} alt="Profile Photo" />
        </div>
        <div className="text">
          <div className="name">
            <h3 onClick={() => navigate(`/profile/${encodeURIComponent(username)}`)}>{username}</h3>
            <div className="friend-badge">
              {isFriend ? "Friend" : "Add Friend"}
            </div>
            {/* Friend request feature to be implemented */}
          </div>
          <div className="availability">
            <span className="availability-label">Available:</span>
            <div className="availability-tags">
              {availability && availability.length > 0 ? (
                availability.map((time, idx) => (
                  <span
                    className="availability-tag"
                    key={`availability-${idx}`}
                  >
                    {time}
                  </span>
                ))
              ) : (
                <span className="availability-tag">Not specified</span>
              )}
            </div>
          </div>
          <div className="skillsShowing">
            <div className="skillsOffered">
              SkillsOffered:
              {skills.map((skill, idx) => (
                <span className="skills" key={`skill-${idx}`}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="skillsWanted">
              SkillsWanted:
              {skillsWanted.map((skill, idx) => (
                <span className="skills" key={`want-${idx}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <button onClick={handleSwapRequestClick}>Swap Request</button>
        <div className="rating">
          {/* ⭐⭐⭐⭐⭐ */}
          <span className="stars">
            {"⭐".repeat(Math.round(averageRating)) || "—"}
          </span>
          <span className="reviews">({reviewCount})</span>
        </div>
      </div>

      <SwapRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipientUsername={username}
        recipientId={userId}
        onSendRequest={sendSwapRequest}
      />
    </div>
  );
};

export default ProfileCard;
