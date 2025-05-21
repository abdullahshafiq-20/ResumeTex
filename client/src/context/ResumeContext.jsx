import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { use } from "react";
import { useAuth } from "./AuthContext";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getUserId } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!getUserId()) return;

    const fetchResumes = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        const response = await api.get(`${apiUrl}/resume/${userId}`);
        setResumes(response.data);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [getUserId]);


  return (
    <ResumeContext.Provider value={{ resumes, loading }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumes = () => useContext(ResumeContext);
