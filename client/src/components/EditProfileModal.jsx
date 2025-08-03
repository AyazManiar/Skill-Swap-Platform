import { useState, useContext } from 'react';
import './EditProfileModal.css';
import { AuthContext } from '../contexts/AuthContext';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const EditProfileModal = ({ currentData, onClose, onProfileUpdated }) => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bio: currentData?.bio || '',
    skills: currentData?.skills || [],
    skillsWanted: currentData?.skillsWanted || [],
    availability: currentData?.availability || [],
    isPublic: currentData?.isPublic || false,
  });
  const [newSkill, setNewSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availabilityOptions = [
    'Weekdays',
    'Weekends', 
    'Mornings',
    'Afternoons',
    'Evenings',
    'Flexible'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvailabilityChange = (option) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...prev.availability, option]
    }));
  };

  const addSkill = (type) => {
    const skill = type === 'offered' ? newSkill.trim() : newWantedSkill.trim();
    if (!skill) return;

    const skillField = type === 'offered' ? 'skills' : 'skillsWanted';
    const setterField = type === 'offered' ? setNewSkill : setNewWantedSkill;

    if (!formData[skillField].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [skillField]: [...prev[skillField], skill]
      }));
      setterField('');
    }
  };

  const removeSkill = (skill, type) => {
    const skillField = type === 'offered' ? 'skills' : 'skillsWanted';
    setFormData(prev => ({
      ...prev,
      [skillField]: prev[skillField].filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseURL}/api/users/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: auth.userId,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      onProfileUpdated(updatedUser);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell others about yourself..."
              maxLength={500}
            />
            <small>{formData.bio.length}/500 characters</small>
          </div>

          <div className="form-group">
            <label>Profile Visibility</label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
              />
              Make my profile public (visible to everyone)
            </label>
          </div>

          <div className="form-group">
            <label>Availability</label>
            <div className="availability-options">
              {availabilityOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(option)}
                    onChange={() => handleAvailabilityChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Skills I Offer</label>
            <div className="skill-input">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill you can teach..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('offered'))}
              />
              <button type="button" onClick={() => addSkill('offered')}>Add</button>
            </div>
            <div className="skills-list">
              {formData.skills.map(skill => (
                <span key={skill} className="skill-tag offered">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill, 'offered')}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Skills I Want to Learn</label>
            <div className="skill-input">
              <input
                type="text"
                value={newWantedSkill}
                onChange={(e) => setNewWantedSkill(e.target.value)}
                placeholder="Add a skill you want to learn..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('wanted'))}
              />
              <button type="button" onClick={() => addSkill('wanted')}>Add</button>
            </div>
            <div className="skills-list">
              {formData.skillsWanted.map(skill => (
                <span key={skill} className="skill-tag wanted">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill, 'wanted')}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="save-button">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;