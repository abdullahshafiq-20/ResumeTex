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
  const [regenerating, setRegenerating] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (posts && posts.length > 0) {
      console.log("Posts in EmailPage:", posts);
      
      // Filter posts that contain emails
      const postsWithEmails = posts.filter(
        (post) => post.extractedEmails && post.extractedEmails.length > 0
      );
      
      // Get IDs of posts that have emails generated or sent
      const generatedPostIds = emailsGenerated.map(post => post._id) || [];
      const sentPostIds = emailsSent.map(post => post._id) || [];
      
      // Make sure no post appears in both arrays
      const uniqueGeneratedPostIds = generatedPostIds.filter(
        id => !sentPostIds.includes(id)
      );
      
      // Filter for pending posts (those with emails but no generated/sent emails)
      const pendingPosts = postsWithEmails.filter(
        post => !generatedPostIds.includes(post._id) && !sentPostIds.includes(post._id)
      );
      
      console.log("Pending posts:", pendingPosts);
      setPendingEmailPosts(pendingPosts);
    }

    // Set default selected resume if available
    if (resumes && resumes.length > 0) {
      setSelectedResumeId(resumes[0]._id);
    }
    
    // Reset email sent flag when changing selected post
    setEmailSent(false);
  }, [posts, resumes, emailsGenerated, emailsSent]);

  const selectPost = (post) => {
    // If it's the same post, deselect it
    if (selectedPost && selectedPost._id === post._id) {
      setSelectedPost(null);
      setGeneratedEmail(null);
      setEmailDetails(null);
      setError(null);
      return;
    }
    
    setSelectedPost(post);
    setGeneratedEmail(null);
    setEmailDetails(null);
    setError(null);
    setEmailSent(false); // Reset email sent flag

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
        const isSent = emailsSent.some(post => post._id === postId);
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

      console.log("Email data:", emailData);    

      const response = await api.post(`${apiUrl}/create-email`, emailData);
      setGeneratedEmail({
        ...response.data,
        to: post.extractedEmails[0],
        resumeId: selectedResumeId
      });
      
      setEmailDetails(null); // Clear existing email details when regenerating
      setEmailSent(false); // Reset email sent flag when regenerating
      
      // Refresh posts to update UI with newly generated email
      await refreshPosts();
    } catch (err) {
      console.error("Error generating email:", err);
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
  }

  const sendEmailWithAttachment = async () => {
    const emailToSend = emailDetails || generatedEmail;
    if (!emailToSend) return;
    
    try {
      setSendingEmail(true);
      setError(null);
      
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
        setEmailSent(true); // Mark as sent to disable UI elements
        await saveEmail(emailWithAttachment); // Save email after sending
        await refreshPosts(); // Refresh posts to update UI
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
    <div 
      key={post._id} 
      className={`bg-white rounded-lg border overflow-hidden flex flex-col cursor-pointer transition-all duration-200 ${
        selectedPost && selectedPost._id === post._id ? 'ring-2 ring-blue-500 border-blue-300' : 
        status === 'generated' ? 'border-purple-300 hover:border-purple-400' : 
        status === 'sent' ? 'border-green-300 hover:border-green-400' : 
        'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => selectPost(post)}
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
      </div>
    </div>
  );

  // Render email inbox view
  const renderEmailInbox = () => {
    if (!selectedPost) return null;
    
    const activeEmail = emailDetails || generatedEmail;
    if (!activeEmail && !isLoading) return null;

    const getResumeNameById = (id) => {
      if (!resumes) return "Selected Resume";
      if (Array.isArray(resumes)) {
        const resume = resumes.find(r => r._id === id);
        return resume?.personalInfo?.name || resume?.resume_title || "Selected Resume";
      }
      return resumes?.personalInfo?.name || resumes?.resume_title || "Selected Resume";
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Email header */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="font-medium text-gray-800">
                {selectedPost.jobTitle || "Job Position"}
              </h2>
            </div>
            
            {/* Only show regenerate button for emails that haven't been sent yet */}
            {(generatedEmail || emailDetails) && !emailSent && (
              <button
                onClick={() => generateEmail()}
                disabled={regenerating}
                className={`flex items-center text-sm gap-1 py-1 px-3 rounded-md 
                  ${regenerating 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
                {regenerating ? "Regenerating..." : "Regenerate Email"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-gray-600">
                {selectedPost.extractedEmails && selectedPost.extractedEmails.length > 0 ?
                  selectedPost.extractedEmails[0] : "No email found"}
              </span>
            </div>
            
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
              <select 
                className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                disabled={emailSent}
              >
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
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">
              {regenerating ? "Regenerating email..." : "Loading email..."}
            </p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-4 rounded-md">
            {error}
          </div>
        )}

        {/* Email content */}
        {!isLoading && activeEmail && (
          <div className="divide-y divide-gray-200">
            {/* Email sent success message */}
            {emailSent && (
              <div className="bg-green-50 border-y border-green-200 text-green-700 p-4 flex items-center">
                <Check size={20} className="mr-2" />
                <div>
                  <p className="font-medium">Email sent successfully!</p>
                  <p className="text-sm">Your email with resume attachment has been sent to {activeEmail.to}.</p>
                </div>
              </div>
            )}
            
            {/* Email fields */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-700">From:</div>
                <span className="text-gray-600">You</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-700">To:</div>
                <input
                  type="email"
                  value={activeEmail.to}
                  onChange={(e) => {
                    if (emailDetails && !emailSent) {
                      setEmailDetails({...emailDetails, to: e.target.value});
                    } else if (!emailSent) {
                      setGeneratedEmail({...generatedEmail, to: e.target.value});
                    }
                  }}
                  disabled={emailSent}
                  className={`flex-1 ml-4 border-b ${
                    emailSent 
                      ? "bg-gray-50 border-gray-200 text-gray-700" 
                      : "bg-transparent border-gray-300 focus:border-blue-500"
                  } focus:outline-none px-1 py-0.5`}
                  readOnly={emailSent}
                />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-700">Subject:</div>
                <button
                  onClick={() => copyToClipboard(activeEmail.subject, "subject")}
                  className="text-blue-600 hover:text-blue-800"
                  title="Copy subject"
                >
                  {copied.subject ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <input
                type="text"
                value={activeEmail.subject}
                onChange={(e) => {
                  if (emailDetails && !emailSent) {
                    setEmailDetails({...emailDetails, subject: e.target.value});
                  } else if (!emailSent) {
                    setGeneratedEmail({...generatedEmail, subject: e.target.value});
                  }
                }}
                disabled={emailSent}
                readOnly={emailSent}
                className={`w-full ${
                  emailSent 
                    ? "bg-gray-50 border-gray-200 text-gray-700" 
                    : "bg-transparent border-b border-gray-300 focus:border-blue-500"
                } focus:outline-none px-1 py-1 font-medium`}
              />
            </div>

            {/* Attachment card */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Attachment</h4>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-w-md mx-auto">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm font-medium">
                      {getResumeNameById(selectedResumeId)}.pdf
                    </span>
                  </div>
                  <div className="flex items-center text-sm space-x-2">
                    <div className="text-xs text-gray-500">PDF</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">Email Body</h3>
                <button
                  onClick={() => copyToClipboard(activeEmail.body, "body")}
                  className="text-blue-600 hover:text-blue-800"
                  title="Copy email body"
                >
                  {copied.body ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <textarea
                value={activeEmail.body}
                onChange={(e) => {
                  if (emailDetails && !emailSent) {
                    setEmailDetails({...emailDetails, body: e.target.value});
                  } else if (!emailSent) {
                    setGeneratedEmail({...generatedEmail, body: e.target.value});
                  }
                }}
                disabled={emailSent}
                readOnly={emailSent}
                rows={12}
                className={`w-full ${
                  emailSent 
                    ? "bg-gray-50 text-gray-700" 
                    : "bg-gray-50 focus:ring-1 focus:ring-blue-500"
                } border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-sm focus:outline-none`}
              />
            </div>

            {/* Email actions - only show if not already sent */}
            {!emailSent && (
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <a
                  href={`mailto:${activeEmail.to}?subject=${encodeURIComponent(activeEmail.subject)}&body=${encodeURIComponent(activeEmail.body)}`}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                >
                  <Mail size={16} />
                  Open in Email Client
                </a>
                
                <button
                  onClick={sendEmailWithAttachment}
                  disabled={sendingEmail}
                  className={`inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${
                    sendingEmail ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {sendingEmail ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Email with Attachment
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* For sent emails, show a different set of actions */}
            {emailSent && (
              <div className="p-4 bg-gray-50 flex justify-center">
                <div className="text-gray-500 text-sm">
                  This email has been sent successfully.
                </div>
              </div>
            )}
          </div>
        )}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar with job posts */}
          <div className="lg:col-span-4">
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
              <div className="space-y-6">
                {/* Pending emails section */}
                {pendingEmailPosts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      Job Posts with Emails ({pendingEmailPosts.length})
                    </h2>
                    <div className="space-y-3">
                      {pendingEmailPosts.map(post => renderPostCard(post))}
                    </div>
                  </div>
                )}

                {/* Emails generated section - filter out any posts that have already been sent */}
                {emailsGenerated && emailsGenerated.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Mail className="h-5 w-5 text-purple-500 mr-2" />
                      Generated Emails ({emailsGenerated.filter(post => 
                        !emailsSent.some(sentPost => sentPost._id === post._id)
                      ).length})
                    </h2>
                    <div className="space-y-3">
                      {emailsGenerated
                        .filter(post => !emailsSent.some(sentPost => sentPost._id === post._id))
                        .map(post => renderPostCard(post, 'generated'))}
                    </div>
                  </div>
                )}

                {/* Emails sent section */}
                {emailsSent && emailsSent.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Send className="h-5 w-5 text-green-500 mr-2" />
                      Sent Emails ({emailsSent.length})
                    </h2>
                    <div className="space-y-3">
                      {emailsSent.map(post => renderPostCard(post, 'sent'))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right content area with email view */}
          <div className="lg:col-span-8">
            {selectedPost ? (
              renderEmailInbox()
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center h-96">
                <Mail className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a job post</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Choose a job post from the left sidebar to generate an email or view previously generated emails.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;