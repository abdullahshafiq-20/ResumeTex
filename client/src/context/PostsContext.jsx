import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [emailsGenerated, setEmailsGenerated] = useState([]);
  const [emailsSent, setEmailsSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getUserId } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!getUserId()) return;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        console.log("Fetching posts for user ID:", userId);
        
        // Get posts and emails
        const postsResponse = await api.get(`${apiUrl}/getPosts/?userId=${userId}`);
        const emailsResponse = await api.get(`${apiUrl}/get-emails`);
        
        console.log("Posts response:", postsResponse.data);
        console.log("Emails response:", emailsResponse.data);
        
        // Extract the actual posts array from the response
        // The API returns { success: true, message: "...", data: [...] }
        const postsData = postsResponse.data?.data || [];
        const emailsData = Array.isArray(emailsResponse.data) ? emailsResponse.data : [];
        
        console.log("Posts data array:", postsData);
        console.log("Emails data array:", emailsData);
        
        // Map emails to posts using linkedInId which corresponds to post._id
        const postsWithEmailStatus = postsData.map(post => {
          // Find corresponding email for this post
          const email = emailsData.find(email => email.linkedInId === post._id);
          
          // Return post with added email status properties
          return {
            ...post,
            isEmailGenerated: email ? email.isEmailGenerated : false,
            isEmailSent: email ? email.isEmailSent : false,
            emailDetails: email || null // Store the full email details if needed
          };
        });
        
        console.log("Posts with email status:", postsWithEmailStatus);
        
        // Update main posts state
        setPosts(postsWithEmailStatus);
        
        // Filter posts based on email status
        const generated = postsWithEmailStatus.filter(post => post.isEmailGenerated === true);
        const sent = postsWithEmailStatus.filter(post => post.isEmailSent === true);
        
        console.log("Generated email posts:", generated);
        console.log("Sent email posts:", sent);
        
        // Update filtered states
        setEmailsGenerated(generated);
        setEmailsSent(sent);
        
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getUserId, apiUrl]);

  // Add a function to refresh posts data
  const refreshPosts = async () => {
    if (!getUserId()) return;
    setLoading(true);
    
    try {
      const userId = getUserId();
      
      // Get posts and emails
      const postsResponse = await api.get(`${apiUrl}/getPosts/?userId=${userId}`);
      const emailsResponse = await api.get(`${apiUrl}/get-emails`);
      
      // Extract the actual posts array from the response
      const postsData = postsResponse.data?.data || [];
      const emailsData = Array.isArray(emailsResponse.data) ? emailsResponse.data : [];
      
      // Map emails to posts
      const postsWithEmailStatus = postsData.map(post => {
        const email = emailsData.find(email => email.linkedInId === post._id);
        return {
          ...post,
          isEmailGenerated: email ? email.isEmailGenerated : false,
          isEmailSent: email ? email.isEmailSent : false,
          emailDetails: email || null
        };
      });
      
      // Update states
      setPosts(postsWithEmailStatus);
      setEmailsGenerated(postsWithEmailStatus.filter(post => post.isEmailGenerated === true));
      setEmailsSent(postsWithEmailStatus.filter(post => post.isEmailSent === true));
      
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailbyId = async (postId) => {
    if (!postId) {
      console.error("Email ID is required");
      return null;
    }
    
    setLoading(true);
    
    try {
      const response = await api.get(`${apiUrl}/get-emails?postId=${postId}`);
      console.log("Fetched email:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching email:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <PostsContext.Provider value={{ 
      posts, 
      emailsGenerated, 
      emailsSent,
      loading,
      refreshPosts,
      fetchEmailbyId,
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);