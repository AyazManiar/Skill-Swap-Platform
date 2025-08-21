import "./Home.css";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router"
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar";
import search from "../assets/icons/search.svg";
import AvailabilityFilter from "../components/AvailabilityFilter";
import ProfileCard from "../components/ProfileCard";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const Home = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchtext, setSearchtext] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem('availability');
    const initialValue = saved ? JSON.parse(saved) : ["Always"];
    return initialValue.includes("Always") ? initialValue : ["Always", ...initialValue];
  });
  useEffect(() => {
    getAllUsers(availability);
  }, [auth, availability]);
  const updateAvailability = async (newAvailability) => {
    if (!newAvailability.includes("Always")) {
      newAvailability = ["Always", ...newAvailability];
    }
    setAvailability(newAvailability);
    localStorage.setItem('availability', JSON.stringify(newAvailability));
    await getAllUsers(newAvailability, searchtext);
  };
  const getAllUsers = async (availabilityFilter = availability, searchText = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      availabilityFilter.forEach((value) => params.append("availability", value)); 
      
      // Add search parameter if search text is provided
      if (searchText.trim() !== "") {
        params.append("search", searchText.trim());
      }
      
      const res = await fetch(baseURL+`/api/users/visible?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  const searchUser = async () => {
    await getAllUsers(availability, searchtext);
  };
  return (
    <div className="Home">
      <Navbar />
      <div className="Content">
        <div className="search">
            <AvailabilityFilter
                availability={availability}
                updateAvailability={updateAvailability}
            />
          <div className="search-bar-container">
            <input type="text" value={searchtext} 
              onChange={(e) => {
                setSearchtext(e.target.value);
                // If search is cleared, refresh the user list
                if (e.target.value.trim() === "") {
                  getAllUsers(availability, "");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchUser();
                }
              }}
              placeholder="Search users by name, bio, or skills..." />
            <img src={search} width={22} alt="Search" onClick={() => searchUser()} />
          </div>
        </div>
        <div className="profileList">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {users.map((user) => {
            const isFriend = auth.friendList && auth.friendList.includes(user._id);
            return <ProfileCard key={user._id} userId={user._id} {...user} isFriend={isFriend} />;
          })}
        </div>
        <div className="pagination"></div>
      </div>
    </div>
  );
};
export default Home;
