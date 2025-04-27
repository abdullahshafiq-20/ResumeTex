// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token received:", token);
      console.log("Redirecting to dashboard...");
  
      setTimeout(() => {
        navigate("/onboard", { replace: true });
      }, 100); // Delay to ensure token is written
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default AuthCallback;
