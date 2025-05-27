import React, { useState } from 'react'
import { usePosts } from '../context/PostsContext'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Mail, Hash, X, Eye, Check, Briefcase } from 'lucide-react'

const PostsPage = () => {
    const { posts, loading, deletePost } = usePosts()
    const { checkConnection } = useAuth()
    const isConnected = checkConnection()
    const [selectedPost, setSelectedPost] = useState(null)

    const openModal = (post) => {
        setSelectedPost(post)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedPost(null)
        document.body.style.overflow = 'auto'
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
            </div>
        )
    }

    const handleDeletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) { 
            try {
                await deletePost(postId)
                alert("Post deleted successfully.")
            } catch (error) {
                console.error("Error deleting post:", error)
                alert("Failed to delete post. Please try again.")
            }
        }
    }
    
    // Convert posts to array if it's not already
    const postsArray = Array.isArray(posts) ? posts : posts?.data || [];
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Connection status banner */}
            <div className={`sticky top-0 z-10 w-full py-2 px-4 text-center text-sm font-medium ${
                isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
                <div className="flex items-center justify-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>Extension {isConnected ? "Connected" : "Disconnected"}</span>
                </div>
            </div>
            
            {/* Main content */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Job Posts</h1>
                
                {postsArray.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center border border-gray-200">
                        <p className="text-gray-500">No posts available yet.</p>
                        <p className="mt-2 text-sm text-gray-400">Posts will appear here once they're extracted.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {postsArray.map((post) => {
                            // Check what information is available in this post
                            const hasJobTitle = !!post.jobTitle;
                            const hasUrls = post.extractedUrls?.length > 0;
                            const hasEmails = post.extractedEmails?.length > 0;
                            const hasHashtags = post.extractedHashtags?.length > 0;
                            
                            return (
                            <motion.div 
                                key={post._id} 
                                className="flex flex-col h-full overflow-hidden rounded-lg bg-white border border-gray-200 transition-colors hover:border-gray-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Status indicators at the top of card */}
                                <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center" title={hasJobTitle ? "Job title available" : "No job title"}>
                                            <Briefcase size={16} className={`${hasJobTitle ? "text-green-500" : "text-gray-300"}`} />
                                            <span className="text-xs mt-1">{hasJobTitle ? "Title" : "No title"}</span>
                                        </div>
                                        
                                        <div className="flex flex-col items-center" title={hasUrls ? `${post.extractedUrls.length} URLs found` : "No URLs"}>
                                            <ExternalLink size={16} className={`${hasUrls ? "text-blue-500" : "text-gray-300"}`} />
                                            <span className="text-xs mt-1">{hasUrls ? `${post.extractedUrls.length}` : "0"}</span>
                                        </div>
                                        
                                        <div className="flex flex-col items-center" title={hasEmails ? `${post.extractedEmails.length} Emails found` : "No emails"}>
                                            <Mail size={16} className={`${hasEmails ? "text-purple-500" : "text-gray-300"}`} />
                                            <span className="text-xs mt-1">{hasEmails ? `${post.extractedEmails.length}` : "0"}</span>
                                        </div>
                                        
                                        <div className="flex flex-col items-center" title={hasHashtags ? `${post.extractedHashtags.length} Hashtags found` : "No hashtags"}>
                                            <Hash size={16} className={`${hasHashtags ? "text-indigo-500" : "text-gray-300"}`} />
                                            <span className="text-xs mt-1">{hasHashtags ? `${post.extractedHashtags.length}` : "0"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                                            <Eye 
                                                size={14} 
                                                className="text-gray-500 cursor-pointer" 
                                                onClick={() => openModal(post)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePost(post._id);
                                            }}
                                            title="Delete post"
                                        >
                                            <X 
                                                size={14} 
                                                className="text-red-500" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {post.jobTitle && (
                                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-3">{post.jobTitle}</h2>
                                    )}
                                    
                                    <div className="mb-4">
                                        <p className="text-gray-600 text-sm line-clamp-4">
                                            {post.content}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {post.extractedUrls?.length > 0 && (
                                            <div className="flex flex-wrap items-start gap-1">
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 border border-blue-100">
                                                    <ExternalLink size={12} className="mr-1" /> 
                                                    URLs:
                                                </span>
                                                {post.extractedUrls.slice(0, 2).map((url, index) => (
                                                    <a 
                                                        key={index} 
                                                        href={url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-block truncate max-w-[150px] text-xs text-blue-600 hover:underline"
                                                    >
                                                        {url}
                                                    </a>
                                                ))}
                                                {post.extractedUrls.length > 2 && (
                                                    <span className="text-xs text-gray-500">+{post.extractedUrls.length - 2} more</span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {post.extractedEmails?.length > 0 && (
                                            <div className="flex flex-wrap items-start gap-1">
                                                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-800 border border-purple-100">
                                                    <Mail size={12} className="mr-1" /> 
                                                    Emails:
                                                </span>
                                                {post.extractedEmails.slice(0, 2).map((email, index) => (
                                                    <a 
                                                        key={index}
                                                        href={`mailto:${email}`}
                                                        className="inline-block truncate max-w-[150px] text-xs text-purple-600 hover:underline"
                                                    >
                                                        {email}
                                                    </a>
                                                ))}
                                                {post.extractedEmails.length > 2 && (
                                                    <span className="text-xs text-gray-500">+{post.extractedEmails.length - 2} more</span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {post.extractedHashtags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {post.extractedHashtags.slice(0, 3).map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-700 border border-gray-200"
                                                    >
                                                        <Hash size={12} className="mr-1" /> 
                                                        {tag}
                                                    </span>
                                                ))}
                                                {post.extractedHashtags.length > 3 && (
                                                    <span className="text-xs text-gray-500">+{post.extractedHashtags.length - 3} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View details button */}
                                <div className="mt-auto p-3 pt-0">
                                    <button 
                                        onClick={() => openModal(post)}
                                        className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>
                )}
                
                {/* Modal for post details */}
                <AnimatePresence>
                    {selectedPost && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                        >
                            <motion.div 
                                className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {selectedPost.jobTitle || "Job Post Details"}
                                        </h2>
                                        <button 
                                            onClick={closeModal}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                            aria-label="Close dialog"
                                        >
                                            <X size={24} className="text-gray-500" />
                                        </button>
                                    </div>
                                    
                                    {/* Full content */}
                                    <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {selectedPost.content}
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        {/* URLs */}
                                        {selectedPost.extractedUrls?.length > 0 && (
                                            <div>
                                                <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                                                    <ExternalLink size={16} className="mr-2 text-blue-600" />
                                                    URLs
                                                </h3>
                                                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                                    <ul className="space-y-2">
                                                        {selectedPost.extractedUrls.map((url, index) => (
                                                            <li key={index} className="break-all">
                                                                <a 
                                                                    href={url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline text-sm"
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
                                                <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                                                    <Mail size={16} className="mr-2 text-purple-600" />
                                                    Email Addresses
                                                </h3>
                                                <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                                                    <ul className="space-y-2">
                                                        {selectedPost.extractedEmails.map((email, index) => (
                                                            <li key={index}>
                                                                <a 
                                                                    href={`mailto:${email}`}
                                                                    className="text-purple-600 hover:underline text-sm"
                                                                >
                                                                    {email}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Hashtags */}
                                        {selectedPost.extractedHashtags?.length > 0 && (
                                            <div>
                                                <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                                                    <Hash size={16} className="mr-2 text-gray-600" />
                                                    Hashtags
                                                </h3>
                                                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPost.extractedHashtags.map((tag, index) => (
                                                            <span 
                                                                key={index}
                                                                className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-sm text-gray-700 border border-gray-200"
                                                            >
                                                                <Hash size={14} className="mr-1" /> 
                                                                {tag}
                                                            </span>
                                                        ))}
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
            </div>
        </div>
    )
}

export default PostsPage