import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useResumes } from "../context/ResumeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Briefcase,
  Send,
  X,
  Copy,
  Check,
  Clipboard,
  FileText,
  Paperclip,
  Download,
  ArrowLeft,
  Eye,
  RefreshCw,
  Bot,
  Sparkles,
  Wand2,
  MessageSquare,
  Clock,
  Plus,
  Target,
  Users,
  Loader2,
} from "lucide-react";
import axios from "axios";
import api from "../utils/api";

// Recipients Modal Component
const RecipientsModal = ({ isOpen, onClose, currentRecipients, onSave, isLoading, emailSuggestions = [] }) => {
  const [recipientsInput, setRecipientsInput] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  const handleSave = () => {
    if (recipientsInput.trim() || selectedSuggestions.length > 0) {
      const inputRecipients = recipientsInput
        .split(",")
        .map(email => email.trim())
        .filter(email => email.length > 0 && isValidEmail(email));
      
      const allRecipients = [...new Set([...inputRecipients, ...selectedSuggestions])];
      onSave(allRecipients);
      setRecipientsInput("");
      setSelectedSuggestions([]);
    }
  };

  const handleClose = () => {
    setRecipientsInput("");
    setSelectedSuggestions([]);
    onClose();
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const toggleSuggestion = (email) => {
    setSelectedSuggestions(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Add Recipients
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Email Suggestions */}
          {emailSuggestions.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggested Recipients
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {emailSuggestions.map((email, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`suggestion-${index}`}
                      checked={selectedSuggestions.includes(email)}
                      onChange={() => toggleSuggestion(email)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`suggestion-${index}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {email}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter email addresses separated by commas
            </label>
            <textarea
              value={recipientsInput}
              onChange={(e) => setRecipientsInput(e.target.value)}
              placeholder="john@company.com, jane@company.com, hr@company.com"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple email addresses with commas
            </p>
          </div>

          {/* Current Recipients Preview */}
          {currentRecipients.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Recipients
              </label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {currentRecipients.map((email, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {email}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || (!recipientsInput.trim() && selectedSuggestions.length === 0)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Recipients</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const EmailPage = () => {
  const { getUserId, getUserProfile } = useAuth();
  const { posts, emailsGenerated, emailsSent, refreshPosts, fetchEmailbyId } =
    usePosts();
  const { resumes } = useResumes();
  const [pendingEmailPosts, setPendingEmailPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [emailDetails, setEmailDetails] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({ subject: false, body: false });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // New state for multiple recipients
  const [recipients, setRecipients] = useState([]);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [isAddingRecipients, setIsAddingRecipients] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Add these animation variants
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

  // Helper function to validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (posts && posts.length > 0) {
      console.log("Posts in EmailPage:", posts);

      // Filter posts that contain emails AND exclude "no match found" posts
      const postsWithEmails = posts.filter(
        (post) => {
          const hasEmails = post.extractedEmails && post.extractedEmails.length > 0;
          const isNoMatchFound = post.jobTitle?.toLowerCase()?.trim()?.includes("no match found");
          
          // Only include posts that have emails AND are not "no match found"
          return hasEmails && !isNoMatchFound;
        }
      );

      // Get IDs of posts that have emails generated or sent
      const generatedPostIds = emailsGenerated.map((post) => post._id) || [];
      const sentPostIds = emailsSent.map((post) => post._id) || [];

      // Make sure no post appears in both arrays
      const uniqueGeneratedPostIds = generatedPostIds.filter(
        (id) => !sentPostIds.includes(id)
      );

      // Filter for pending posts (those with emails but no generated/sent emails)
      const pendingPosts = postsWithEmails.filter(
        (post) =>
          !generatedPostIds.includes(post._id) &&
          !sentPostIds.includes(post._id)
      );

      console.log("Posts with emails (excluding no match found):", postsWithEmails);
      console.log("Pending posts:", pendingPosts);
      setPendingEmailPosts(pendingPosts);
    }

    // Only set default selected resume if no resume is currently selected
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0]._id);
    }

    // Reset email sent flag when changing selected post
    setEmailSent(false);
  }, [posts, resumes, emailsGenerated, emailsSent]);

  const selectPost = (post) => {
    // If it's the same post, deselect it (only on desktop)
    if (selectedPost && selectedPost._id === post._id && !isMobile) {
      setSelectedPost(null);
      setGeneratedEmail(null);
      setEmailDetails(null);
      setError(null);
      setRecipients([]);
      return;
    }

    setSelectedPost(post);
    setGeneratedEmail(null);
    setEmailDetails(null);
    setError(null);
    setEmailSent(false);
    
    // Initialize recipients with the first extracted email
    if (post.extractedEmails && post.extractedEmails.length > 0) {
      setRecipients([post.extractedEmails[0]]);
    } else {
      setRecipients([]);
    }

    // Open modal on mobile devices
    if (isMobile) {
      setIsMobileModalOpen(true);
    }

    // If the post already has an email generated or sent, fetch it
    if (post.isEmailGenerated || post.isEmailSent) {
      fetchEmailDetails(post._id);
    } else {
      // Auto-generate email for pending posts when selected
      generateEmail(post);
    }
  };

  const fetchEmailDetails = async (postId) => {
    setIsLoading(true);
    try {
      const emailData = await fetchEmailbyId(postId);
      if (emailData && emailData.length > 0) {
        setEmailDetails(emailData[0]);
        // Set emailSent flag if this post is in the sent emails list
        const isSent = emailsSent.some((post) => post._id === postId);
        setEmailSent(isSent);
      }
    } catch (err) {
      console.error("Error fetching email details:", err);
      setError("Failed to load email details");
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmail = async (post = selectedPost) => {
    if (!post || !selectedResumeId) return;

    try {
      setIsLoading(true);
      setRegenerating(true);
      setError(null);

      const emailData = {
        email: post.extractedEmails[0], // Using the first email
        jobTitle: post.jobTitle || "Job Position",
        jobDescription: post.content || "",
        companyName: "",
        resume_id: selectedResumeId,
        postId: post._id,
      };

      const response = await api.post(`${apiUrl}/create-email`, emailData);
      console.log("response", response)

      // Format the email data properly
      const newEmail = {
        to: post.extractedEmails[0],
        subject: response.data.subject || response.data.data?.subject,
        body: response.data.body || response.data.data?.body,
        resumeId: selectedResumeId,
        attachment: response.data.attachment || response.data.data?.attachment,
      };

      // Only update the states after we have the new email and ensure it has content
      if (newEmail.subject && newEmail.body) {
        setGeneratedEmail(newEmail);
        setEmailDetails(null);
        setEmailSent(false);
      } else {
        throw new Error("Generated email is missing required fields");
      }

      await refreshPosts();
    } catch (err) {
      console.error("Email generation error:", err);
      setError("Failed to generate email. Please try again.");
    } finally {
      setIsLoading(false);
      setRegenerating(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });

    setTimeout(() => {
      setCopied({ ...copied, [field]: false });
    }, 2000);
  };

  const saveEmail = async (emailWithAttachment) => {
    try {
      const emailData = {
        postId: selectedPost._id,
        resumeId: selectedResumeId,
        ...emailWithAttachment,
      };
      console.log("Saving email data:", emailData);

      const response = await api.post(`${apiUrl}/save-email`, emailData);
      console.log("Email saved:", response.data);

      // Refresh posts to update the UI with the newly saved email
      await refreshPosts();
    } catch (error) {
      console.error("Error saving email:", error);
      setError("Failed to save email. Please try again.");
    }
  };

  // Modified functions to handle multiple recipients
  const handleAddRecipients = async (newRecipients) => {
    setIsAddingRecipients(true);
    try {
      // Combine existing recipients with new ones, removing duplicates
      const updatedRecipients = [...new Set([...recipients, ...newRecipients])];
      setRecipients(updatedRecipients);
      setShowRecipientsModal(false);
    } catch (error) {
      console.error("Error adding recipients:", error);
    } finally {
      setIsAddingRecipients(false);
    }
  };

  const removeRecipient = (index) => {
    setRecipients(prev => prev.filter((_, i) => i !== index));
  };

    const getResumeNameById = (id) => {
      if (!resumes) return "Selected Resume";
      if (Array.isArray(resumes)) {
        const resume = resumes.find((r) => r._id === id);
        const name = `${getUserProfile().name} - ${resume.resume_title}`;
        return name;
      }
      return (
        resumes?.personalInfo?.name ||
        resumes?.resume_title ||
        "Selected Resume"
      );
    };

  const renderEmailInbox = () => {
    // Get the active email data
    const activeEmail = emailDetails || generatedEmail;
    if (!activeEmail) return null;

    // Convert recipients array to comma-separated string for backward compatibility
    const recipientsString = recipients.join(', ');

    return (
      <motion.div
        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Email header */}
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Email Preview
              </span>
              {emailSent && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Sent
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Resume: {getResumeNameById(selectedResumeId)}
            </div>
          </div>
        </div>

        {/* Email content */}
          <div className="divide-y divide-gray-200 relative z-10">
            {/* Email sent success message */}
            {emailSent && (
              <div className="bg-green-50 border-y border-green-200 text-green-700 p-3 flex items-center">
                <Check size={16} className="mr-2" />
                <div>
                  <p className="text-sm font-medium">
                    Email sent successfully!
                  </p>
                  <p className="text-xs">
                    Your email with resume attachment has been sent to{" "}
                    {(() => {
                      // Get recipients from database (emailDetails) when email is sent
                      const sentRecipients = emailDetails?.to ? 
                        emailDetails.to.split(', ').filter(email => email.trim()) : 
                        recipients;
                      
                      if (sentRecipients.length > 1) {
                        return `${sentRecipients.length} recipients: ${sentRecipients.join(', ')}`;
                      } else {
                        return sentRecipients[0] || 'recipient';
                      }
                    })()}
                  </p>
                </div>
              </div>
            )}

            {/* Email fields */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">From:</div>
              <span className="text-xs text-gray-600">
                {getUserProfile()?.email || "Your Email"}
              </span>
              </div>
            </div>

          {/* Modified To section with multiple recipients support */}
            <div className="p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">To:</div>
                {!emailSent && (
                  <button
                    onClick={() => setShowRecipientsModal(true)}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Recipients</span>
                  </button>
                )}
              </div>
              
              {/* Recipients display */}
              <div className="flex flex-wrap gap-1.5">
                {(() => {
                  // Get recipients from database when email is sent, otherwise use local state
                  const displayRecipients = emailSent && emailDetails?.to ? 
                    emailDetails.to.split(', ').filter(email => email.trim()) : 
                    recipients;
                  
                  return displayRecipients.map((email, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium ${
                        !emailSent ? 'flex items-center space-x-1' : ''
                      }`}
                    >
                      <span>{email}</span>
                      {!emailSent && (
                        <button
                          onClick={() => removeRecipient(index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ));
                })()}
                {(() => {
                  const displayRecipients = emailSent && emailDetails?.to ? 
                    emailDetails.to.split(', ').filter(email => email.trim()) : 
                    recipients;
                  
                  return displayRecipients.length === 0 && (
                    <span className="text-xs text-gray-500 italic">
                      No recipients added
                    </span>
                  );
                })()}
              </div>
              </div>
            </div>

          {/* Subject field - unchanged */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Subject:
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(activeEmail.subject, "subject")
                  }
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Copy subject"
                >
                  {copied.subject ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <input
                type="text"
                value={activeEmail.subject}
                onChange={(e) => {
                  if (emailDetails && !emailSent) {
                    setEmailDetails({
                      ...emailDetails,
                      subject: e.target.value,
                    });
                  } else if (!emailSent) {
                    setGeneratedEmail({
                      ...generatedEmail,
                      subject: e.target.value,
                    });
                  }
                }}
                disabled={emailSent}
                readOnly={emailSent}
                className={`w-full text-xs ${
                  emailSent
                    ? "bg-gray-50 border-gray-200 text-gray-700"
                    : "bg-transparent border-b border-gray-200 focus:border-blue-300"
                } focus:outline-none px-1 py-1 font-medium`}
              />
            </div>

            {/* Attachment card */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Paperclip className="h-3 w-3 text-gray-500 mr-2" />
                <h4 className="text-xs font-medium text-gray-700">
                  Attachment
                </h4>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-w-sm">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-xs font-medium">
                      {getResumeNameById(selectedResumeId)}.pdf
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">PDF</div>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Email Body
                </h3>
                <button
                  onClick={() => copyToClipboard(activeEmail.body, "body")}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Copy email body"
                >
                  {copied.body ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <textarea
                value={activeEmail.body}
                onChange={(e) => {
                  if (emailDetails && !emailSent) {
                    setEmailDetails({ ...emailDetails, body: e.target.value });
                  } else if (!emailSent) {
                    setGeneratedEmail({
                      ...generatedEmail,
                      body: e.target.value,
                    });
                  }
                }}
                disabled={emailSent}
                readOnly={emailSent}
                rows={20}
                className={`w-full text-xs ${
                  emailSent
                    ? "bg-gray-50 text-gray-700"
                    : "bg-gray-50 focus:ring-1 focus:ring-blue-300"
                } border border-gray-200 rounded-md p-3 whitespace-pre-wrap focus:outline-none`}
              />
            </div>

            {/* Professional regenerate section */}
            {(generatedEmail || emailDetails) && !emailSent && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-2">
                    <div className="relative">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Don't like the generated email?
                      </p>
                      <p className="text-xs text-gray-600">
                        Our AI can create a different version tailored to your preferences
                      </p>
                    </div>
                  </div>
                  
                  {/* AI-themed Generate Again Button */}
                  <button
                    onClick={() => generateEmail()}
                    disabled={regenerating}
                    className={`group relative px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px] sm:min-w-[160px] ${
                      regenerating
                        ? "opacity-75 cursor-not-allowed scale-100"
                        : "hover:from-purple-700 hover:to-blue-700"
                    }`}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    
                    <div className="relative flex items-center justify-center space-x-1.5 sm:space-x-2">
                      {regenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                          <span className="hidden sm:inline">AI Regenerating...</span>
                          <span className="sm:hidden">Regenerating...</span>
                          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                        </>
                      ) : (
                        <>
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                          <span className="hidden sm:inline">AI Generate Again</span>
                          <span className="sm:hidden">Generate Again</span>
                          <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                    
                    {/* Floating particles effect */}
                    {!regenerating && (
                      <>
                        <div className="absolute top-1 left-2 w-1 h-1 bg-white/40 rounded-full animate-ping delay-100"></div>
                        <div className="absolute bottom-1 right-3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-300"></div>
                        <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-white/60 rounded-full animate-ping delay-500"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Email actions - only show if not already sent */}
            {!emailSent && (
              <div className="p-4 bg-gray-50/50 flex justify-between items-center">
                <a
                href={`mailto:${recipientsString}?subject=${encodeURIComponent(
                    activeEmail.subject
                  )}&body=${encodeURIComponent(activeEmail.body)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-md transition-colors hover:bg-gray-50 text-xs font-medium"
                >
                  <Mail size={14} />
                  Open in Email Client
                </a>

                <button
                onClick={() => sendEmailWithAttachment()}
                  disabled={sendingEmail}
                  className={`group relative px-4 py-2 bg-transparent border border-blue-500 text-blue-600 rounded-md transition-all duration-200 text-xs font-medium overflow-hidden ${
                    sendingEmail
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative flex items-center space-x-1.5">
                    {sendingEmail ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                        <span>Sending...</span>
                        <Sparkles className="h-3 w-3 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Email</span>
                        <Target className="h-3 w-3" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* For sent emails, show a different set of actions */}
            {emailSent && (
              <div className="p-4 bg-gray-50/50 flex justify-center">
                <div className="text-gray-500 text-xs">
                  This email has been sent successfully.
                </div>
              </div>
            )}
          </div>
      </motion.div>
    );
  };

  // Modified sendEmailWithAttachment to handle multiple recipients
  const sendEmailWithAttachment = async () => {
    if (!selectedPost || !selectedResumeId || recipients.length === 0) {
      alert("Please ensure you have selected a post, resume, and at least one recipient.");
      return;
    }

    // Get the active email data
    const activeEmail = emailDetails || generatedEmail;
    if (!activeEmail) return;

    try {
      setSendingEmail(true);

      // For multiple recipients, we can either:
      // 1. Send individual emails to each recipient
      // 2. Send one email with all recipients in the 'to' field
      // Let's go with option 2 for simplicity
      
      const emailData = {
        to: recipients, // Send array of recipients
        subject: activeEmail.subject,
        message: activeEmail.body,
        pdfUrl: activeEmail.attachment,
      };

      const response = await api.post(`${apiUrl}/send-email-with-attachment`, emailData);
      
      if (response.data.success) {
        // Save email record
        const saveEmailData = {
          postId: selectedPost._id,
          resumeId: selectedResumeId,
          to: recipients.join(', '), // Store as comma-separated string
          subject: activeEmail.subject,
          body: activeEmail.body,
          pdfUrl: activeEmail.attachment,
        };

        await api.post(`${apiUrl}/save-email`, saveEmailData);

        setEmailSent(true);
        await refreshPosts();
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Get email suggestions from the selected post
  const getEmailSuggestions = () => {
    if (selectedPost && selectedPost.extractedEmails) {
      return selectedPost.extractedEmails.filter(email => !recipients.includes(email));
    }
    return [];
  };

  // Add function to close mobile modal
  const closeMobileModal = () => {
    setIsMobileModalOpen(false);
    if (isMobile) {
      setSelectedPost(null);
      setGeneratedEmail(null);
      setEmailDetails(null);
      setError(null);
    }
  };

  // Add mobile modal component
  const renderMobileModal = () => {
    if (!isMobile || !isMobileModalOpen || !selectedPost) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeMobileModal}
          />

          {/* Modal content */}
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Email Review
                </h2>
              </div>
              <button
                onClick={closeMobileModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Modal body - scrollable */}
            <div className="flex-1 overflow-y-auto">{renderEmailInbox()}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Add this missing renderPostCard function
  const renderPostCard = (post, status = null) => (
    <motion.div
      key={post._id}
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 relative overflow-hidden ${
        selectedPost && selectedPost._id === post._id
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={() => selectPost(post)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Status indicator */}
      {status && (
        <div className="absolute top-2 right-2">
          {status === "generated" && (
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          )}
          {status === "sent" && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      )}

      {/* Background gradient */}
      <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-lg"></div>

      <div className="relative z-10">
        {/* Job title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.jobTitle || "Job Position"}
        </h3>

        {/* Company info */}
        {post.company && (
          <p className="text-xs text-gray-600 mb-2">{post.company}</p>
        )}

        {/* Content preview */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-3">
          {post.content?.substring(0, 120)}
          {post.content?.length > 120 ? "..." : ""}
        </p>

        {/* Email count and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-gray-500">
              {post.extractedEmails?.length || 0} email
              {post.extractedEmails?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Status badges */}
          <div className="flex items-center space-x-1">
            {status === "generated" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Bot className="h-3 w-3 mr-1" />
                Generated
              </span>
            )}
            {status === "sent" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="h-3 w-3 mr-1" />
                Sent
              </span>
            )}
            {!status && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Email preview */}
        {post.extractedEmails && post.extractedEmails.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500 truncate">
                {post.extractedEmails[0]}
                {post.extractedEmails.length > 1 && 
                  ` +${post.extractedEmails.length - 1} more`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  // If no resumes are loaded yet
  if (!resumes || resumes.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="max-w-mdbg-white rounded-lg relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-center text-gray-700 mb-2">
                Resume Required
              </h2>
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                Please upload or create a resume first to generate personalized
                emails for your job applications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Recipients Modal */}
      <RecipientsModal
        isOpen={showRecipientsModal}
        onClose={() => setShowRecipientsModal(false)}
        currentRecipients={recipients}
        onSave={handleAddRecipients}
        isLoading={isAddingRecipients}
        emailSuggestions={getEmailSuggestions()}
      />

      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-8 blur-2xl -z-10"></div>
      <div className="absolute top-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-6 blur-xl -z-10"></div>

      <motion.div
        className=""
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Live Update Indicator */}
        <motion.div
          className="mb-6 p-3 rounded-lg border border-gray-200 bg-white relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-green-200/30 to-blue-200/20 blur-sm"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                Live Updates
              </span>
              <span className="text-xs text-gray-500">
                • Real-time email sync
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* AI Notice */}
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
                  AI-Powered Email Generator
                </h3>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-400"></div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                Transform your job applications with intelligent email
                generation. Our AI crafts personalized cover letters tailored to
                each position, enhancing your professional communication.
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
            Email Generator
          </h1>
          <p className="text-sm text-gray-600">
            Generate personalized emails for job applications based on your
            resume
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar with job posts - always show on mobile */}
          <div className="lg:col-span-4">
            {/* If no posts with emails found */}
            {!posts ||
            (posts.length === 0 &&
              !pendingEmailPosts.length &&
              !emailsGenerated.length &&
              !emailsSent.length) ? (
              <motion.div
                className="bg-white p-6 rounded-lg border border-gray-200 text-center relative overflow-hidden"
                variants={itemVariants}
              >
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    No Email Opportunities
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We couldn't find any job posts with email contacts. Browse
                    more job posts to discover email opportunities.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div className="space-y-6" variants={containerVariants}>
                {/* Pending emails section */}
                {pendingEmailPosts.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 text-blue-500 mr-2" />
                      Job Posts with Emails ({pendingEmailPosts.length})
                    </h2>
                    <div className="space-y-3">
                      {pendingEmailPosts.map((post) => renderPostCard(post))}
                    </div>
                  </motion.div>
                )}

                {/* Emails generated section */}
                {emailsGenerated && emailsGenerated.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Mail className="h-4 w-4 text-purple-500 mr-2" />
                      Generated Emails (
                      {
                        emailsGenerated.filter(
                          (post) =>
                            !emailsSent.some(
                              (sentPost) => sentPost._id === post._id
                            )
                        ).length
                      }
                      )
                    </h2>
                    <div className="space-y-3">
                      {emailsGenerated
                        .filter(
                          (post) =>
                            !emailsSent.some(
                              (sentPost) => sentPost._id === post._id
                            )
                        )
                        .map((post) => renderPostCard(post, "generated"))}
                    </div>
                  </motion.div>
                )}

                {/* Emails sent section */}
                {emailsSent && emailsSent.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Send className="h-4 w-4 text-green-500 mr-2" />
                      Sent Emails ({emailsSent.length})
                    </h2>
                    <div className="space-y-3">
                      {emailsSent.map((post) => renderPostCard(post, "sent"))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right content area with email view - hide on mobile when modal is open */}
          <div className={`lg:col-span-8 ${isMobile ? "hidden" : ""}`}>
            {selectedPost ? (
              renderEmailInbox()
            ) : (
              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center h-96 relative overflow-hidden"
                variants={itemVariants}
              >
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-xl"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Select a job post
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-md leading-relaxed">
                    Choose a job post from the left sidebar to generate an email
                    or view previously generated emails.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile modal */}
        {renderMobileModal()}
      </motion.div>
    </div>
  );
};

export default EmailPage;
