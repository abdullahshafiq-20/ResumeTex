import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure to install this: npm install jwt-decode
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gmailPermission, setGmailPermission] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Add function to fetch user profile from server
  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`${apiUrl}/user`);
      if (response.status === 200) {
        setUserProfile(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If profile fetch fails, fall back to JWT data
      return null;
    }
  };

  useEffect(() => {
    // Check for token in localStorage on initial load
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode token to get user data
          const decoded = jwtDecode(token);

          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired, log out user
            logoutUser();
          } else {
            setUser(decoded);
            setIsAuthenticated(true);
            setGmailPermission(decoded.gmail_permission);
            // Fetch fresh user profile data from server
            const profileData = await fetchUserProfile();
            if (!profileData) {
              // If server fetch fails, fall back to JWT data
              setUserProfile(decoded);
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          logoutUser();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await api.get(`${apiUrl}/connectionStatus`);
      if (response.status === 200) {
        console.log("Connection is good");
      } else {
        console.error("Connection error:", response.status);
      }
      return response.isExtensionConnected;
    } catch (error) {
      console.error("Error checking connection:", error);
      return false;
    }
  };

  // Login user and store token
  const loginUser = async (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);
    setGmailPermission(decoded.gmail_permission);
    console.log(decoded.gmail_permission);
    // Fetch fresh user profile data after login
    const profileData = await fetchUserProfile();
    if (!profileData) {
      // If server fetch fails, fall back to JWT data
      setUserProfile(decoded);
    }
  };

  // Logout user and remove token
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get the auth token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Get the user ID from decoded token
  const getUserId = () => {
    return user ? user.id || user._id || user.userId : null;
  };
  
  const getUserProfile = () => {
    return userProfile;
  };

  const getGmailPermission = () => {
    return gmailPermission;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        loginUser,
        logoutUser,
        getToken,
        getUserId,
        checkConnection,
        getUserProfile,
        getGmailPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
