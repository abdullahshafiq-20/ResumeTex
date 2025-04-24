import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file
  
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Replace with your actual API endpoint that validates tokens
        const response = await axios.get(`${api}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          setIsValid(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token"); // Clear invalid token
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token"); // Clear invalid token
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, []);
  
  if (isLoading) {
    // Show loading state while validating
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isValid) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PrivateRoute;