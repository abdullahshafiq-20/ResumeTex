import React, { useState } from 'react'
import { usePosts } from '../context/PostsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Mail, Hash, X, Eye, Briefcase, Plus, Send, Clock } from 'lucide-react'

const PostsPage = () => {
    const { posts, loading, deletePost, savePost, updatePostStatus } = usePosts()
    const [selectedPost, setSelectedPost] = useState(null)
    const [newPostContent, setNewPostContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('not-sent') // 'not-sent' or 'sent'

    const openModal = (post) => {
        setSelectedPost(post)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedPost(null)
        document.body.style.overflow = 'auto'
    }

    const handleSavePost = async () => {
        if (!newPostContent.trim()) {
            alert("Please enter some content for the post.")
            return
        }
        console.log("Saving post:", newPostContent.trim())

        setIsSaving(true)
        try {
            await savePost(newPostContent.trim())
            setNewPostContent('')
            alert("Post saved successfully!")
        } catch (error) {
            console.error("Error saving post:", error)
            alert("Failed to save post. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleMarkAsSent = async (postId) => {
        try {
            await updatePostStatus(postId, true)
            alert("Post marked as sent!")
        } catch (error) {
            console.error("Error updating post status:", error)
            alert("Failed to update post status. Please try again.")
        }
    }

    const handleMarkAsNotSent = async (postId) => {
        try {
            await updatePostStatus(postId, false)
            alert("Post marked as not sent!")
        } catch (error) {
            console.error("Error updating post status:", error)
            alert("Failed to update post status. Please try again.")
        }
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
    
    // Separate posts based on sent status
    const notSentPosts = postsArray.filter(post => !post.isEmailSent);
    const sentPosts = postsArray.filter(post => post.isEmailSent);
    
    const renderPostCard = (post) => {
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
                        {/* Sent status toggle */}
                        <div 
                            className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-colors ${
                                post.isEmailSent 
                                    ? 'bg-green-50 hover:bg-green-100' 
                                    : 'bg-orange-50 hover:bg-orange-100'
                            }`}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     post.isEmailSent ? handleMarkAsNotSent(post._id) : handleMarkAsSent(post._id);
                            // }}
                            // title={post.isEmailSent ? "Mark as not sent" : "Mark as sent"}
                        >
                            {post.isEmailSent ? (
                                <Send size={14} className="text-green-600" />
                            ) : (
                                <Clock size={14} className="text-orange-600" />
                            )}
                        </div>
                        
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

                {/* Status badge */}
                <div className="px-4 pt-2">
                    <span 
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            post.isEmailSent 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}
                    >
                        {post.isEmailSent ? (
                            <>
                                <Send size={12} className="mr-1" />
                                Sent
                            </>
                        ) : (
                            <>
                                <Clock size={12} className="mr-1" />
                                Not Sent
                            </>
                        )}
                    </span>
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
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main content */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Job Posts</h1>
                
                {/* Add new post section */}
                <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Plus size={20} className="mr-2 text-blue-600" />
                        Add New Job Post
                    </h2>
                    <div className="space-y-4">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Enter job post content here... Include job title, description, requirements, contact information, etc."
                            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            disabled={isSaving}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleSavePost}
                                disabled={isSaving || !newPostContent.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        Save Post
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs for separating sent/not sent posts */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('not-sent')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeTab === 'not-sent'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Clock size={16} />
                            Not Sent ({notSentPosts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeTab === 'sent'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Send size={16} />
                            Sent ({sentPosts.length})
                        </button>
                    </div>
                </div>

                {/* Posts display based on active tab */}
                {activeTab === 'not-sent' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Clock size={20} className="mr-2 text-orange-600" />
                            Posts Not Sent ({notSentPosts.length})
                        </h2>
                        {notSentPosts.length === 0 ? (
                            <div className="rounded-lg bg-white p-8 text-center border border-gray-200">
                                <Clock size={48} className="mx-auto text-orange-300 mb-4" />
                                <p className="text-gray-500">No posts pending to be sent.</p>
                                <p className="mt-2 text-sm text-gray-400">All your posts have been sent!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {notSentPosts.map(renderPostCard)}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sent' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Send size={20} className="mr-2 text-green-600" />
                            Sent Posts ({sentPosts.length})
                        </h2>
                        {sentPosts.length === 0 ? (
                            <div className="rounded-lg bg-white p-8 text-center border border-gray-200">
                                <Send size={48} className="mx-auto text-green-300 mb-4" />
                                <p className="text-gray-500">No posts have been sent yet.</p>
                                <p className="mt-2 text-sm text-gray-400">Start sending your job posts to track them here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sentPosts.map(renderPostCard)}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Modal for post details - same as before... */}
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
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                {selectedPost.jobTitle || "Job Post Details"}
                                            </h2>
                                            <span 
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    selectedPost.isEmailSent 
                                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                                                }`}
                                            >
                                                {selectedPost.isEmailSent ? (
                                                    <>
                                                        <Send size={12} className="mr-1" />
                                                        Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock size={12} className="mr-1" />
                                                        Not Sent
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={closeModal}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                            aria-label="Close dialog"
                                        >
                                            <X size={24} className="text-gray-500" />
                                        </button>
                                    </div>
                                    
                                    {/* Status toggle in modal */}
                                    {/* <div className="mb-4">
                                        <button
                                            onClick={() => {
                                                selectedPost.isEmailSent 
                                                    ? handleMarkAsNotSent(selectedPost._id) 
                                                    : handleMarkAsSent(selectedPost._id);
                                                closeModal();
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                                selectedPost.isEmailSent
                                                    ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
                                                    : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                                            }`}
                                        >
                                            {selectedPost.isEmailSent ? (
                                                <>
                                                    <Clock size={16} />
                                                    Mark as Not Sent
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    Mark as Sent
                                                </>
                                            )}
                                        </button>
                                    </div> */}
                                    
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