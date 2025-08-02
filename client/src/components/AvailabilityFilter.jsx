import { useState } from "react";
import "./AvailabilityFilter.css";

const availabilityOptions = [
  "Always", "Occasionally", "Monthly", "Biweekly", "Weekly", "One-time",
  "Weekdays", "Weekends",
  "Early Mornings", "Mornings", "Afternoons", "Evenings", "Nights", "Late Nights",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "Specific Hours", "Flexible", "By Appointment", "Unavailable Temporarily"
];

const AvailabilityFilter = ({ availability, updateAvailability }) => {
  const [availabilitySearch, setAvailabilitySearch] = useState("");
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const handleAvailabilityClick = () => {
    setIsAvailabilityOpen(!isAvailabilityOpen);
  };

  const handleAvailabilitySelect = async (option) => {
    if (!availability.includes(option)) {
      const newAvailability = [...availability, option];
      await updateAvailability(newAvailability);
    }
    setAvailabilitySearch("");
    setIsAvailabilityOpen(false);
  };

  const handleRemoveAvailability = async (optionToRemove) => {
    if (optionToRemove === "Always") return;
    const newAvailability = availability.filter(option => option !== optionToRemove);
    await updateAvailability(newAvailability);
  };

  const filteredOptions = availabilityOptions.filter(option =>
    option.toLowerCase().includes(availabilitySearch.toLowerCase()) &&
    !availability.includes(option)
  );

  return (
    <div className="availability-container" onClick={() => {setIsAvailabilityOpen(false)}}>
      <div className="availability-badges">
        {availability.map((item, index) => (
          <div key={index} className={`availability-badge ${item === 'Always' ? 'permanent' : ''}`}>
            {item}
            {item !== 'Always' && (
              <span className="remove-badge" onClick={() => handleRemoveAvailability(item)}>
                ×
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="availability-select">
        <input
          type="text"
          placeholder="Add availability..."
          value={availabilitySearch}
          onChange={(e) => setAvailabilitySearch(e.target.value)}
          onClick={(e) => {
            e.stopPropagation();
            setIsAvailabilityOpen(true);
          }}
        />
      </div>
      {isAvailabilityOpen && filteredOptions.length > 0 && (
        <div className="availability-dropdown">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="availability-option"
              onClick={() => handleAvailabilitySelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityFilter;
