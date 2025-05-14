import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getUserId } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!getUserId()) return;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        const response = await api.get(`${apiUrl}/getPosts/?userId=${userId}`);
        setPosts(response.data);
        console.log("Posts fetched:", response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getUserId]);

  return (
    <PostsContext.Provider value={{ posts, loading }}>
      {children}
    </PostsContext.Provider>
  );
};


export const usePosts = () => useContext(PostsContext);