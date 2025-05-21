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
} from "lucide-react";
import axios from "axios";
import api from "../utils/api";

const EmailPage = () => {
  const { getUserId } = useAuth();
  const { posts, emailsGenerated, emailsSent, refreshPosts, fetchEmailbyId } = usePosts();
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
  const [viewMode, setViewMode] = useState("generate"); // "generate", "view"
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (posts && posts.length > 0) {
      console.log("Posts in EmailPage:", posts);
      
      // Filter posts that contain emails
      const postsWithEmails = posts.filter(
        (post) => post.extractedEmails && post.extractedEmails.length > 0
      );
      
      console.log("Posts with emails:", postsWithEmails);
      console.log("emailsGenerated:", emailsGenerated);
      console.log("emailsSent:", emailsSent);
      
      // Get IDs of posts that have emails generated or sent
      const generatedPostIds = emailsGenerated.map(post => post._id) || [];
      const sentPostIds = emailsSent.map(post => post._id) || [];
      
      const processedPostIds = [...generatedPostIds, ...sentPostIds];
      
      // Filter for pending posts (those with emails but no generated/sent emails)
      const pendingPosts = postsWithEmails.filter(
        post => !processedPostIds.includes(post._id)
      );
      
      console.log("Pending posts:", pendingPosts);
      setPendingEmailPosts(pendingPosts);
    }

    // Set default selected resume if available
    if (resumes && resumes.length > 0) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [posts, resumes, emailsGenerated, emailsSent]);

  const selectPost = (post) => {
    setSelectedPost(post);
    setGeneratedEmail(null);
    setEmailDetails(null);
    setViewMode("generate");
    setError(null);

    // If the post already has an email generated or sent, fetch it
    if (post.isEmailGenerated || post.isEmailSent) {
      fetchEmailDetails(post._id);
    }
  };

  const fetchEmailDetails = async (postId) => {
    setIsLoading(true);
    try {
      const emailData = await fetchEmailbyId(postId);
      if (emailData && emailData.length > 0) {
        setEmailDetails(emailData[0]);
        setViewMode("view");
      }
    } catch (err) {
      console.error("Error fetching email details:", err);
      setError("Failed to load email details");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
    setGeneratedEmail(null);
    setEmailDetails(null);
    setViewMode("generate");
    setError(null);
  };

  const generateEmail = async () => {
    if (!selectedPost || !selectedResumeId) return;

    try {
      setIsLoading(true);
      setError(null);

      const emailData = {
        email: selectedPost.extractedEmails[0], // Using the first email
        jobTitle: selectedPost.jobTitle || "Job Position",
        jobDescription: selectedPost.content || "",
        companyName: "",
        resume_id: selectedResumeId,
        postId: selectedPost._id,
      };

      console.log("Email data:", emailData);    

      const response = await api.post(`${apiUrl}/create-email`, emailData);
      setGeneratedEmail({
        ...response.data,
        to: selectedPost.extractedEmails[0],
        resumeId: selectedResumeId
      });
      
      // Refresh posts to update UI with newly generated email
      await refreshPosts();
    } catch (err) {
      console.error("Error generating email:", err);
      setError("Failed to generate email. Please try again.");
    } finally {
      setIsLoading(false);
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
      refreshPosts();
      
    } catch (error) {
      console.error("Error saving email:", error);
      setError("Failed to save email. Please try again.");
    }
  }

  const sendEmailWithAttachment = async () => {
    const emailToSend = emailDetails || generatedEmail;
    if (!emailToSend) return;
    
    try {
      setSendingEmail(true);
      setError(null);
      setEmailSent(false); // Reset email sent status
      
      // If we have a direct attachment URL from emailDetails, use it
      let attachmentUrl = emailToSend.attachment;
      
      // Otherwise, find the selected resume to get its attachment URL
      if (!attachmentUrl) {
        const resumeId = emailToSend.resumeId;
        const selectedResume = Array.isArray(resumes) 
          ? resumes.find(resume => resume._id === resumeId) 
          : resumes;
        
        // Check for cloudinaryUrl or resume_link
        attachmentUrl = selectedResume?.cloudinaryUrl || selectedResume?.resume_link;
      }
      
      if (!attachmentUrl) {
        throw new Error("Resume attachment not found");
      }
      
      const emailWithAttachment = {
        to: emailToSend.to,
        subject: emailToSend.subject,
        message: emailToSend.body,
        pdfUrl: attachmentUrl
      };
      
      console.log("Sending email with attachment:", emailWithAttachment);
      
      const response = await api.post(`${apiUrl}/send-email-with-attachment`, emailWithAttachment);
      console.log("Email send response:", response.data);
      
      if (response.data.success) {
        setEmailSent(true);
        await saveEmail(emailWithAttachment); // Save email after sending
        await refreshPosts();
      } else {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      console.error("Error sending email with attachment:", err);
      setError("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Render a post card
  const renderPostCard = (post, status = null) => (
    <motion.div 
      key={post._id} 
      className={`bg-white rounded-lg border overflow-hidden flex flex-col ${
        status === 'generated' ? 'border-purple-300' : 
        status === 'sent' ? 'border-green-300' : 
        'border-gray-200'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {status && (
        <div className={`py-1 px-3 text-xs font-medium text-white ${
          status === 'generated' ? 'bg-purple-500' : 'bg-green-500'
        }`}>
          {status === 'generated' ? 'Email Generated' : 'Email Sent'}
        </div>
      )}
      
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-800 line-clamp-1">
          {post.jobTitle || "Untitled Position"}
        </h3>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex items-start mb-3">
          <Mail className="h-4 w-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
          <div className="flex flex-col space-y-1">
            {post.extractedEmails && post.extractedEmails.map((email, index) => (
              <span key={index} className="text-sm text-purple-600">{email}</span>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.content}</p>
        
        <div className="flex items-center mb-4">
          <FileText className="h-4 w-4 text-gray-500 mr-2" />
          <select 
            className="text-sm border border-gray-300 rounded-md py-1 px-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedResumeId(e.target.value)}
            defaultValue={selectedResumeId}
          >
            <option value="" disabled>Select a resume</option>
            {Array.isArray(resumes) ? resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.personalInfo?.name || resume.resume_title || "Unnamed Resume"}
              </option>
            )) : (
              <option value={resumes?._id}>
                {resumes?.personalInfo?.name || resumes?.resume_title || "Your Resume"}
              </option>
            )}
          </select>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <button 
          onClick={() => selectPost(post)}
          disabled={!selectedResumeId}
          className={`w-full flex items-center justify-center gap-2 text-sm text-white ${
            status === 'sent' ? 'bg-green-600 hover:bg-green-700' :
            status === 'generated' ? 'bg-purple-600 hover:bg-purple-700' :
            'bg-blue-600 hover:bg-blue-700'
          } py-2 px-4 rounded-md transition-colors ${
            !selectedResumeId ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {status === 'sent' ? <Eye size={16} /> : 
           status === 'generated' ? <Eye size={16} /> : 
           <Send size={16} />}
          {status === 'sent' ? 'View Sent Email' : 
           status === 'generated' ? 'View Generated Email' : 
           'Generate Email'}
        </button>
      </div>
    </motion.div>
  );

  // Render email viewer similar to Gmail
  const renderEmailViewer = () => {
    const email = emailDetails;
    if (!email) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setViewMode("generate")}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>

          {email.isEmailSent ? (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              Email Sent
            </div>
          ) : (
            <button
              onClick={sendEmailWithAttachment}
              disabled={sendingEmail}
              className={`flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md ${
                sendingEmail ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {sendingEmail ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Send size={14} />
              )}
              {sendingEmail ? "Sending..." : "Send"}
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          {/* Email Header */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-medium text-gray-800">{email.subject}</h3>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => copyToClipboard(email.subject, "subject")} 
                  className="text-gray-500 hover:text-gray-700"
                  title="Copy subject"
                >
                  {copied.subject ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-500 w-16">From:</span>
                <span className="text-gray-900">You</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">To:</span>
                <span className="text-gray-900">{email.to}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">Date:</span>
                <span className="text-gray-900">
                  {new Date(email.createdAt).toLocaleDateString()} at {new Date(email.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 relative">
            <div className="mb-4 relative">
              <div className="absolute right-0 top-0">
                <button 
                  onClick={() => copyToClipboard(email.body, "body")}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Copy email body"
                >
                  {copied.body ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              
              <div className="whitespace-pre-wrap text-gray-800 mb-8 pt-2 pr-8">
                {email.body}
              </div>
            </div>

            {/* Attachment Section */}
            {email.attachment && (
              <div className="mt-8 border-t border-gray-200 pt-4">
                <div className="flex items-start">
                  <Paperclip className="h-5 w-5 text-gray-500 mt-2 mr-3" />
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments (1)</h4>
                    
                    {/* PDF Attachment Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-sm font-medium">Resume.pdf</span>
                        </div>
                        <a 
                          href={email.attachment} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          <Download size={14} className="mr-1" />
                          Download
                        </a>
                      </div>
                      
                      <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <iframe 
                          src={email.attachment} 
                          className="w-full h-full" 
                          title="Resume attachment"
                          frameBorder="0"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Actions */}
        <div className="flex justify-end space-x-3">
          <a
            href={`mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
          >
            <Mail size={16} />
            Open in Email Client
          </a>
          
          {!email.isEmailSent && (
            <button
              onClick={sendEmailWithAttachment}
              disabled={sendingEmail}
              className={`flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md ${
                sendingEmail ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {sendingEmail ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  // If no resumes are loaded yet
  if (!resumes || resumes.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
            Resume Required
          </h2>
          <p className="text-gray-600 text-center">
            Please upload or create a resume first to generate personalized
            emails.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800">Email Generator</h1>
          <p className="mt-1 text-sm text-gray-600">
            Generate personalized emails for job applications based on your
            resume
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* If no posts with emails found */}
        {!posts || (posts.length === 0 && !pendingEmailPosts.length && !emailsGenerated.length && !emailsSent.length) ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Email Opportunities
            </h3>
            <p className="mt-2 text-gray-600">
              We couldn't find any job posts with email contacts. Browse more
              job posts to discover email opportunities.
            </p>
          </div>
        ) : (
          <>
            {/* Emails sent section */}
            {emailsSent && emailsSent.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Send className="h-5 w-5 text-green-500 mr-2" />
                  Sent Emails ({emailsSent.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emailsSent.map(post => renderPostCard(post, 'sent'))}
                </div>
              </div>
            )}

            {/* Emails generated section */}
            {emailsGenerated && emailsGenerated.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Mail className="h-5 w-5 text-purple-500 mr-2" />
                  Generated Emails ({emailsGenerated.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emailsGenerated.map(post => renderPostCard(post, 'generated'))}
                </div>
              </div>
            )}

            {/* Pending emails section */}
            {pendingEmailPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                  Job Posts with Email Contacts ({pendingEmailPosts.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingEmailPosts.map(post => renderPostCard(post))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Email modal - now with email viewer mode */}
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
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Show email viewer if in view mode */}
                {viewMode === "view" && emailDetails ? (
                  renderEmailViewer()
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        Generate Email for {selectedPost.jobTitle || "Job Position"}
                      </h2>
                      <button
                        onClick={closeModal}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close dialog"
                      >
                        <X size={24} className="text-gray-500" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">
                          {selectedPost.jobTitle || "Untitled Position"}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="text-purple-600">
                          {selectedPost.extractedEmails && selectedPost.extractedEmails.length > 0 ?
                            selectedPost.extractedEmails[0] : "No email found"}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <select 
                          className="border border-gray-300 rounded-md py-1 px-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                        >
                          <option value="" disabled>Select a resume</option>
                          {Array.isArray(resumes) ? resumes.map((resume) => (
                            <option key={resume._id} value={resume._id}>
                              {resume.personalInfo?.name || resume.resume_title || "Unnamed Resume"}
                            </option>
                          )) : (
                            <option value={resumes?._id}>
                              {resumes?.personalInfo?.name || resumes?.resume_title || "Your Resume"}
                            </option>
                          )}
                        </select>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <h3 className="font-medium text-gray-700 mb-2">Job Description</h3>
                        <p className="text-sm text-gray-600 line-clamp-4">
                          {selectedPost.content || "No job description available."}
                        </p>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                        {error}
                      </div>
                    )}

                    {!generatedEmail ? (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={generateEmail}
                          disabled={isLoading}
                          className={`flex items-center justify-center gap-2 text-white bg-blue-600 py-2 px-4 rounded-md transition-colors ${
                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Mail size={16} />
                              Generate Email
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {emailSent ? (
                          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6 flex items-center">
                            <Check size={20} className="mr-2" />
                            <div>
                              <p className="font-medium">Email sent successfully!</p>
                              <p className="text-sm">Your email with resume attachment has been sent.</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-700">To</h3>
                              </div>
                              <input
                                type="email"
                                value={generatedEmail.to}
                                onChange={(e) => setGeneratedEmail({...generatedEmail, to: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm"
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-700">Subject Line</h3>
                                <button
                                  onClick={() => copyToClipboard(generatedEmail.subject, "subject")}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  {copied.subject ? (
                                    <>
                                      <Check size={14} />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={14} />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <input
                                type="text"
                                value={generatedEmail.subject}
                                onChange={(e) => setGeneratedEmail({...generatedEmail, subject: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-700">Email Body</h3>
                                <button
                                  onClick={() => copyToClipboard(generatedEmail.body, "body")}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  {copied.body ? (
                                    <>
                                      <Check size={14} />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={14} />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <textarea
                                value={generatedEmail.body}
                                onChange={(e) => setGeneratedEmail({...generatedEmail, body: e.target.value})}
                                rows={10}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap text-sm"
                              />
                            </div>

                            <div className="flex justify-between gap-4">
                              <button
                                onClick={() => setGeneratedEmail(null)}
                                className="flex items-center justify-center gap-2 text-gray-600 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                <X size={16} />
                                Regenerate
                              </button>

                              <button
                                onClick={sendEmailWithAttachment}
                                disabled={sendingEmail}
                                className={`flex items-center justify-center gap-2 text-white bg-purple-600 py-2 px-4 rounded-md transition-colors flex-1 ${
                                  sendingEmail ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"
                                }`}
                              >
                                {sendingEmail ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send size={16} />
                                    Send Email with Resume
                                  </>
                                )}
                              </button>

                              <a
                                href={`mailto:${
                                  generatedEmail.to
                                }?subject=${encodeURIComponent(
                                  generatedEmail.subject
                                )}&body=${encodeURIComponent(generatedEmail.body)}`}
                                className="flex items-center justify-center gap-2 text-white bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Mail size={16} />
                                Open in Email Client
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailPage;