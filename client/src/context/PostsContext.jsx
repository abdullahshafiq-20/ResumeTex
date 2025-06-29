import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import { useSocket } from "./SocketContext";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [emailsGenerated, setEmailsGenerated] = useState([]);
  const [emailsSent, setEmailsSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getUserId } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { socket, isConnected, onEvent } = useSocket();

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

  // Add socket listeners for posts and emails
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('Setting up posts socket listeners...');

    // Listen for new posts created
    const handlePostCreated = (data) => {
      console.log('Post created via socket:', data);
      if (data.type === 'post_created' && data.data) {
        setPosts(prev => [data.data, ...prev]);
      }
    };

    // Listen for email created/generated
    const handleEmailCreated = (data) => {
      console.log('Email created via socket:', data);
      if (data.type === 'email_created' && data.data) {
        // Refresh posts to update email status
        refreshPosts();
      }
    };

    // Listen for email sent
    const handleEmailSent = (data) => {
      console.log('Email sent via socket:', data);
      if (data.type === 'email_sent' && data.data) {
        // Update the specific post's email status
        setPosts(prev => prev.map(post => {
          if (post._id === data.data.linkedInId) {
            return {
              ...post,
              isEmailSent: true,
              emailDetails: data.data
            };
          }
          return post;
        }));
        
        // Also refresh to get latest data
        refreshPosts();
      }
    };

    // Set up event listeners using the onEvent function
    const cleanupPost = onEvent('post_created', handlePostCreated);
    const cleanupEmailCreated = onEvent('email_created', handleEmailCreated);
    const cleanupEmailSent = onEvent('email_sent', handleEmailSent);

    // Cleanup function
    return () => {
      console.log('Cleaning up posts socket listeners...');
      if (cleanupPost) cleanupPost();
      if (cleanupEmailCreated) cleanupEmailCreated();
      if (cleanupEmailSent) cleanupEmailSent();
    };
  }, [socket, isConnected, onEvent]);

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

  const savePost = async (postData) => {
    if (!postData) {
      console.error("Post data is required");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`${apiUrl}/extension/savePost`, {
        content: postData
      });
      console.log("Save response:", response.data);
      
      // Refresh posts after saving
      await refreshPosts();
      
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setLoading(false);
    }
  }

  const deletePost = async (postId) => {
    if (!postId) {
      console.error("Post ID is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.delete(`${apiUrl}/deletePost/${postId}`);
      console.log("Delete response:", response.data);
      
      // Refresh posts after deletion
      await refreshPosts();
      
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
    }
  }

  const updatePostStatus = async (postId, isEmailSent) => {
    if (!postId) {
      console.error("Post ID is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.patch(`${apiUrl}/updatePostStatus/${postId}`, {
        isEmailSent: isEmailSent
      });
      console.log("Update status response:", response.data);
      
      // Update local state immediately for better UX
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            isEmailSent: isEmailSent
          };
        }
        return post;
      }));
      
      // Refresh posts to sync with server
      await refreshPosts();
      
    } catch (error) {
      console.error("Error updating post status:", error);
      throw error; // Re-throw to handle in UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      emailsGenerated, 
      emailsSent,
      loading,
      refreshPosts,
      fetchEmailbyId,
      deletePost,
      savePost,
      updatePostStatus
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);