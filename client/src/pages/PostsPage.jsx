import React, { useState } from "react";
import { usePosts } from "../context/PostsContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Hash,
  X,
  Eye,
  Briefcase,
  Plus,
  Send,
  Clock,
  MessageSquare,
  FileText,
  Calendar,
  Bot,
  Wand2,
  Rocket,
  Target,
  Sparkles,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useDashboard } from "../context/DashbaordContext";

const PostsPage = () => {
  const {
    posts,
    loading: initialLoading,
    deletePost,
    savePost,
    updatePostStatus,
    isSocketConnected,
  } = usePosts();
  const { socket } = useSocket();
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [updatingPostId, setUpdatingPostId] = useState(null);
  const [activeTab, setActiveTab] = useState("not-sent");
  const [deleteConfirmPost, setDeleteConfirmPost] = useState(null);
  const { lastUpdated, isLive } = useDashboard();
  // Function to emit notification
  const showNotification = (message, type = "info") => {
    if (socket) {
      socket.emit("notification", {
        type: type,
        message: message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  const handleSavePost = async () => {
    if (!newPostContent.trim()) {
      showNotification("Please enter some content for the post.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await savePost(newPostContent.trim());
      setNewPostContent("");
      showNotification("Post saved successfully!", "success");
    } catch (error) {
      console.error("Error saving post:", error);
      showNotification("Failed to save post. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsSent = async (postId) => {
    setUpdatingPostId(postId);
    try {
      await updatePostStatus(postId, true);
      showNotification("Post marked as sent!", "success");
    } catch (error) {
      console.error("Error updating post status:", error);
      showNotification(
        "Failed to update post status. Please try again.",
        "error"
      );
    } finally {
      setUpdatingPostId(null);
    }
  };

  const handleMarkAsNotSent = async (postId) => {
    setUpdatingPostId(postId);
    try {
      await updatePostStatus(postId, false);
      showNotification("Post marked as not sent!", "success");
    } catch (error) {
      console.error("Error updating post status:", error);
      showNotification(
        "Failed to update post status. Please try again.",
        "error"
      );
    } finally {
      setUpdatingPostId(null);
    }
  };

  const handleDeletePost = async (postId) => {
    setDeletingPostId(postId);
    try {
      await deletePost(postId);
      showNotification("Post deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting post:", error);
      showNotification("Failed to delete post. Please try again.", "error");
    } finally {
      setDeletingPostId(null);
      setDeleteConfirmPost(null);
    }
  };

  const openDeleteModal = (post) => {
    setDeleteConfirmPost(post);
    document.body.style.overflow = "hidden";
  };

  const closeDeleteModal = () => {
    setDeleteConfirmPost(null);
    document.body.style.overflow = "auto";
  };

  // Only show page loading on initial load when not saving
  if (
    initialLoading &&
    (!posts || (Array.isArray(posts) ? posts.length === 0 : !posts.data)) &&
    !isSaving
  ) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-600">Loading your posts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert posts to array if it's not already
  const postsArray = Array.isArray(posts) ? posts : posts?.data || [];

  // Separate posts based on sent status
  const notSentPosts = postsArray.filter((post) => !post.isEmailSent);
  const sentPosts = postsArray.filter((post) => post.isEmailSent);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  const renderPostCard = (post) => {
    // Check what information is available in this post
    const hasJobTitle = !!post.jobTitle;
    const hasUrls = post.extractedUrls?.length > 0;
    const hasEmails = post.extractedEmails?.length > 0;
    const hasHashtags = post.extractedHashtags?.length > 0;
    const isDeleting = deletingPostId === post._id;
    const isUpdating = updatingPostId === post._id;
  
    // More robust comparison for "no match found"
    const isNoMatchFound = post.jobTitle?.toLowerCase()?.trim()?.includes("no match found") || 
                          post.jobTitle?.toLowerCase()?.trim() === "no match found";
  
    // Enhanced debugging
    //console.log("Post ID:", post._id);
    //console.log("Job Title:", `"${post.jobTitle}"`);
    //console.log("Job Title Length:", post.jobTitle?.length);
    //console.log("Trimmed Job Title:", `"${post.jobTitle?.trim()}"`);
    //console.log("Lowercase Job Title:", `"${post.jobTitle?.toLowerCase()?.trim()}"`);
    //console.log("Is No Match Found:", isNoMatchFound);
    //console.log("---");

    return (
      <motion.div
        key={post._id}
        className={`border rounded-lg overflow-hidden group transition-all duration-200 relative ${
          isNoMatchFound 
            ? "bg-red-50 border-red-200" 
            : "bg-white border-gray-200"
        }`}
        variants={itemVariants}

      >
        {/* Debug indicator - remove this once working */}


        {/* Subtle background blob */}
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isNoMatchFound 
            ? "bg-gradient-to-br from-red-200/30 to-orange-200/20" 
            : "bg-gradient-to-br from-blue-200/20 to-purple-200/15"
        }`}></div>

        {/* Warning indicator for no match found */}
        {/* {isNoMatchFound && (
          <div className="absolute top-1 left-1 z-10">
            <div className="bg-red-500 text-white rounded-full p-1" title="No match found - Email cannot be generated">
              <AlertTriangle size={12} />
            </div>
          </div>
        )} */}

        {/* Status indicators at the top of card */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-100 ${
          isNoMatchFound ? "bg-red-50/50" : "bg-gray-50/50"
        }`}>
          <div className="flex gap-3">
            <div
              className="flex flex-col items-center"
              title={hasJobTitle ? "Job title available" : "No job title"}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  hasJobTitle 
                    ? isNoMatchFound 
                      ? "bg-red-100" 
                      : "bg-green-100" 
                    : "bg-gray-100"
                }`}
              >
                <Briefcase
                  size={12}
                  className={
                    hasJobTitle 
                      ? isNoMatchFound 
                        ? "text-red-600" 
                        : "text-green-600" 
                      : "text-gray-400"
                  }
                />
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {hasJobTitle ? "Title" : "No title"}
              </span>
            </div>

            <div
              className="flex flex-col items-center"
              title={
                hasUrls ? `${post.extractedUrls.length} URLs found` : "No URLs"
              }
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  hasUrls ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <ExternalLink
                  size={12}
                  className={hasUrls ? "text-blue-600" : "text-gray-400"}
                />
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {hasUrls ? `${post.extractedUrls.length}` : "0"}
              </span>
            </div>

            <div
              className="flex flex-col items-center"
              title={
                hasEmails
                  ? `${post.extractedEmails.length} Emails found`
                  : "No emails"
              }
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  hasEmails ? "bg-purple-100" : "bg-gray-100"
                }`}
              >
                <Mail
                  size={12}
                  className={hasEmails ? "text-purple-600" : "text-gray-400"}
                />
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {hasEmails ? `${post.extractedEmails.length}` : "0"}
              </span>
            </div>

            <div
              className="flex flex-col items-center"
              title={
                hasHashtags
                  ? `${post.extractedHashtags.length} Hashtags found`
                  : "No hashtags"
              }
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  hasHashtags ? "bg-indigo-100" : "bg-gray-100"
                }`}
              >
                <Hash
                  size={12}
                  className={hasHashtags ? "text-indigo-600" : "text-gray-400"}
                />
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {hasHashtags ? `${post.extractedHashtags.length}` : "0"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                post.isEmailSent
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
              title={post.isEmailSent ? "Sent" : "Not sent"}
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-3 w-3 border border-gray-500 border-t-transparent"></div>
              ) : post.isEmailSent ? (
                <Send size={12} />
              ) : (
                <Clock size={12} />
              )}
            </div>

            <button
              className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => openModal(post)}
              disabled={isDeleting || isUpdating}
            >
              <Eye size={12} />
            </button>

            <button
              className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(post);
              }}
              disabled={isDeleting || isUpdating}
              title="Delete post"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-3 w-3 border border-red-500 border-t-transparent"></div>
              ) : (
                <Trash2 size={12} />
              )}
            </button>
          </div>
        </div>

        {/* Status badge */}
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                post.isEmailSent
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-orange-100 text-orange-800 border border-orange-200"
              }`}
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-2 w-2 border border-current border-t-transparent mr-1"></div>
                  Updating...
                </>
              ) : post.isEmailSent ? (
                <>
                  <Send size={10} className="mr-1" />
                  Sent
                </>
              ) : (
                <>
                  <Clock size={10} className="mr-1" />
                  Pending
                </>
              )}
            </span>
            {isNoMatchFound && (
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                <AlertTriangle size={10} className="mr-1" />
                No Email Generation
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          {post.jobTitle && (
            <h3 className={`text-sm font-semibold line-clamp-1 mb-3 flex items-center ${
              isNoMatchFound ? "text-red-800" : "text-gray-800"
            }`}>
              <Briefcase className={`h-3 w-3 mr-1.5 ${
                isNoMatchFound ? "text-red-600" : "text-blue-600"
              }`} />
              {post.jobTitle}
            </h3>
          )}

          <div className="mb-4">
            <p className="text-gray-600 text-xs line-clamp-4 leading-relaxed">
              {post.content}
            </p>
          </div>

          <div className="space-y-2">
            {post.extractedUrls?.length > 0 && (
              <div className="flex flex-wrap items-start gap-1">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 border border-blue-100">
                  <ExternalLink size={10} className="mr-1" />
                  URLs:
                </span>
                {post.extractedUrls.slice(0, 1).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block truncate max-w-[120px] text-xs text-blue-600 hover:underline"
                  >
                    {url}
                  </a>
                ))}
                {post.extractedUrls.length > 1 && (
                  <span className="text-xs text-gray-500">
                    +{post.extractedUrls.length - 1} more
                  </span>
                )}
              </div>
            )}

            {post.extractedEmails?.length > 0 && (
              <div className="flex flex-wrap items-start gap-1">
                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-800 border border-purple-100">
                  <Mail size={10} className="mr-1" />
                  Emails:
                </span>
                {post.extractedEmails.slice(0, 1).map((email, index) => (
                  <a
                    key={index}
                    href={`mailto:${email}`}
                    className="inline-block truncate max-w-[120px] text-xs text-purple-600 hover:underline"
                  >
                    {email}
                  </a>
                ))}
                {post.extractedEmails.length > 1 && (
                  <span className="text-xs text-gray-500">
                    +{post.extractedEmails.length - 1} more
                  </span>
                )}
              </div>
            )}

            {post.extractedHashtags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.extractedHashtags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-700 border border-gray-200"
                  >
                    <Hash size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
                {post.extractedHashtags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{post.extractedHashtags.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View details button */}
        <div className="p-3 pt-0">
          <button
            onClick={() => openModal(post)}
            disabled={isDeleting || isUpdating}
            className="w-full flex items-center justify-center gap-2 text-xs text-blue-600 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye size={12} />
            View Details
          </button>
        </div>

        {/* Loading overlay for card */}
        {(isDeleting || isUpdating) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border border-blue-600 border-t-transparent"></div>
              <span className="text-xs text-gray-600">
                {isDeleting ? "Deleting..." : "Updating..."}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-8 blur-2xl -z-10"></div>
      <div className="absolute top-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-6 blur-xl -z-10"></div>

      <motion.div
        className=" "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Live Status Indicator */}

              {/* Live Status Indicator */}
      <motion.div
        className="mb-6 p-3 rounded-lg border border-gray-200 bg-white relative overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></div>
            <span className={`text-sm font-medium ${isLive ? "text-green-700" : "text-yellow-700"}`}>
              Live Update
            </span>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                • {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </motion.div>

        <motion.div
          className="mb-6 border border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg p-4 relative overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Subtle animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-1/4 w-4 h-4 bg-purple-200/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-2 right-1/3 w-3 h-3 bg-blue-200/30 rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-1/2 right-6 w-2 h-2 bg-indigo-200/50 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="relative flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Wand2 className="h-4 w-4 text-purple-600 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Important Notice
                </h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-2">
              Only posts that include an email address and relevant contact information will be displayed in the Email section. Posts without an email will not be shown in this section
              </p>
            </div>

            <div className="flex-shrink-0">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse delay-500" />
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h1 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
            Job Posts
          </h1>
          <p className="text-sm text-gray-600">
            Manage and track your job post submissions
          </p>
        </motion.div>

        {/* Add new post section */}
        <motion.div
          className="mb-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border border-gray-200 rounded-lg relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Beautiful floating blobs */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/30 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200/30 to-pink-200/20 blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-purple-200/20 to-blue-200/15 blur-lg"></div>

          <div className="relative z-10 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-blue-600" />
              Add New Job Post
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Enter job post content here... Include job title, description, requirements, contact information, etc."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-vertical focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:border outline-none text-sm bg-white/80 backdrop-blur-sm"
                  disabled={isSaving}
                />
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-green-200/30 to-blue-200/20 blur-sm opacity-50"></div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSavePost}
                  disabled={isSaving || !newPostContent.trim()}
                  className="group relative px-6 py-3 bg-transparent border border-blue-500 hover:border-blue-600 text-blue-600 hover:text-blue-700 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 hover:bg-blue-50 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>

                  {/* Main content */}
                  <div className="relative flex items-center space-x-2">
                    {isSaving ? (
                      <>
                        <div className="relative">
                          <div className="animate-spin rounded-full h-4 w-4 border border-blue-500 border-t-transparent"></div>
                        </div>
                        <span className="font-medium">Saving...</span>
                        <Sparkles className="h-4 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                        <span className="font-medium">Save Post</span>
                        <Plus className="h-4 w-4" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs for separating sent/not sent posts */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex space-x-1 bg-white border border-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("not-sent")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "not-sent"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Clock size={14} />
              Pending ({notSentPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "sent"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Send size={14} />
              Sent ({sentPosts.length})
            </button>
          </div>
        </motion.div>

        {/* Posts display based on active tab */}
        {activeTab === "not-sent" && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Pending Posts ({notSentPosts.length})
              </h2>
            </div>
            {notSentPosts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-orange-200/20 to-yellow-200/15 blur-xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No posts pending to be sent.
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    All your posts have been sent!
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
              >
                {notSentPosts.map(renderPostCard)}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "sent" && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <Send className="h-5 w-5 mr-2 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Sent Posts ({sentPosts.length})
              </h2>
            </div>
            {sentPosts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-green-200/20 to-blue-200/15 blur-xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No posts have been sent yet.
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Start sending your job posts to track them here.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
              >
                {sentPosts.map(renderPostCard)}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Modal for post details - keeping existing modal code */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal gradient blobs */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/20 blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-200/20 to-pink-200/15 blur-xl"></div>

                <div className="relative p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        {selectedPost.jobTitle || "Job Post Details"}
                      </h2>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          selectedPost.isEmailSent
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-orange-100 text-orange-800 border border-orange-200"
                        }`}
                      >
                        {selectedPost.isEmailSent ? (
                          <>
                            <Send size={10} className="mr-1" />
                            Sent
                          </>
                        ) : (
                          <>
                            <Clock size={10} className="mr-1" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                      aria-label="Close dialog"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Full content */}
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedPost.content}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* URLs */}
                    {selectedPost.extractedUrls?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <ExternalLink
                            size={14}
                            className="mr-2 text-blue-600"
                          />
                          URLs
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <ul className="space-y-2">
                            {selectedPost.extractedUrls.map((url, index) => (
                              <li key={index} className="break-all">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-xs"
                                >
                                  {url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Emails */}
                    {selectedPost.extractedEmails?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Mail size={14} className="mr-2 text-purple-600" />
                          Email Addresses
                        </h3>
                        <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                          <ul className="space-y-2">
                            {selectedPost.extractedEmails.map(
                              (email, index) => (
                                <li key={index}>
                                  <a
                                    href={`mailto:${email}`}
                                    className="text-purple-600 hover:underline text-xs"
                                  >
                                    {email}
                                  </a>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {selectedPost.extractedHashtags?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Hash size={14} className="mr-2 text-gray-600" />
                          Hashtags
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {selectedPost.extractedHashtags.map(
                              (tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-700 border border-gray-200"
                                >
                                  <Hash size={10} className="mr-1" />
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmPost && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-lg w-full max-w-md relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal gradient blobs */}
                <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-red-200/30 to-orange-200/20 blur-2xl"></div>
                <div className="absolute bottom-2 left-2 w-12 h-12 rounded-full bg-gradient-to-br from-gray-200/20 to-red-200/15 blur-xl"></div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          Delete Post
                        </h2>
                        <p className="text-sm text-gray-600">
                          This action cannot be undone
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeDeleteModal}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                      aria-label="Close dialog"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Post preview */}
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
                    {deleteConfirmPost.jobTitle && (
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1.5 text-blue-600" />
                        {deleteConfirmPost.jobTitle}
                      </h3>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {deleteConfirmPost.content}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeDeleteModal}
                      disabled={deletingPostId === deleteConfirmPost._id}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeletePost(deleteConfirmPost._id)}
                      disabled={deletingPostId === deleteConfirmPost._id}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {deletingPostId === deleteConfirmPost._id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} />
                          Delete Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PostsPage;
