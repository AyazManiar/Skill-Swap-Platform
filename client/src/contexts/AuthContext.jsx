import { createContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { toastSuccess, toastError } from "../lib/useToast";

export const AuthContext = createContext();
const baseURL = import.meta.env.VITE_API_BASE_URL;
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    userId: null,
    username: "",
    role: null,
  });
  const [loading, setLoading] = useState(true);

  const checkLoggedIn = useCallback(async () => {
    try {
      const res = await fetch(baseURL + "/api/auth/checkLoggedIn", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.isLoggedIn) {
        setAuth({
          isLoggedIn: true,
          userId: data.userId,
          username: data.username,
          profilePicture: data.profilePicture,
          role: data.role,
          friendList: data.friendList,
        });
        console.log("Checked Logged in: true");
      } else {
        setAuth({
          isLoggedIn: false,
          userId: null,
          profilePicture: null,
          role: null,
          friendList: [],
        });
        console.log("Checked Logged in: false");
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);
  useEffect(() => {
    checkLoggedIn();
  }, []);
  const logout = async () => {
    try {
      const res = await fetch(`${baseURL}/api/auth/logOut`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toastError(errorData.message || "Failed to log out");
        return;
      }
        setAuth({
            isLoggedIn: false,
            userId: null,
            username: "",
            profilePicture: null,
            role: null,
            friendList: [],
        });
        toastSuccess("Logged out successfully");
    } catch (error) {
        toastError("Failed to log out, Error: " + error.message);
    }
  };
  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
