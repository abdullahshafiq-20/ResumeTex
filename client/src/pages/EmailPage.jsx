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
} from "lucide-react";
import axios from "axios";
import api from "../utils/api";

const EmailPage = () => {
  const { user } = useAuth();
  const { resumes } = useResumes();
  const { posts } = usePosts();
  const [emailPosts, setEmailPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({ subject: false, body: false });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (posts?.data) {
      // Filter posts that contain emails
      const postsWithEmails = posts.data.filter(
        (post) => post.extractedEmails && post.extractedEmails.length > 0
      );
      setEmailPosts(postsWithEmails);
    }

    // Set default selected resume if available
    if (resumes && resumes.length > 0) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [posts, resumes]);

  const selectPost = (post) => {
    setSelectedPost(post);
    setGeneratedEmail(null);
    setError(null);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setGeneratedEmail(null);
    setError(null);
  };

  const generateEmail = async () => {
    if (!selectedPost || !selectedResumeId) return;

    try {
      setIsLoading(true);
      setError(null);

      const emailData = {
        to: selectedPost.extractedEmails[0], // Using the first email
        jobTitle: selectedPost.jobTitle || "Job Position",
        jobDescription: selectedPost.content || "",
        companyName: "",
        resume_id: selectedResumeId,
      };

      console.log("Email data:", emailData);    

      const response = await api.post(`${apiUrl}/create-email`, emailData);
      setGeneratedEmail({
        ...response.data,
        to: selectedPost.extractedEmails[0],
        resumeId: selectedResumeId
      });
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

  const sendEmailWithAttachment = async () => {
    if (!generatedEmail || !generatedEmail.resumeId) return;
    
    try {
      setSendingEmail(true);
      setError(null);
      setEmailSent(false); // Reset email sent status
      
      // Find the selected resume to get its attachment URL
      const selectedResume = Array.isArray(resumes) 
        ? resumes.find(resume => resume._id === generatedEmail.resumeId) 
        : resumes;
      
      // Check for cloudinaryUrl or resume_link
      const attachmentUrl = selectedResume?.cloudinaryUrl || selectedResume?.resume_link;
      
      if (!attachmentUrl) {
        throw new Error("Resume attachment not found");
      }
      
      const emailWithAttachment = {
        to: generatedEmail.to,
        subject: generatedEmail.subject,
        message: generatedEmail.body,
        pdfUrl: attachmentUrl
      };
      
      console.log("Sending email with attachment:", emailWithAttachment);
      
      const response = await api.post(`${apiUrl}/send-email-with-attachment`, emailWithAttachment);
      console.log("Email send response:", response.data);
      
      if (response.data.success) {
        setEmailSent(true);
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
        {emailPosts.length === 0 ? (
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Job Posts with Email Contacts ({emailPosts.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emailPosts.map((post) => (
                <motion.div 
                  key={post._id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 line-clamp-1">
                      {post.jobTitle || "Untitled Position"}
                    </h3>
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <div className="flex items-start mb-3">
                      <Mail className="h-4 w-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                      <div className="flex flex-col space-y-1">
                        {post.extractedEmails.map((email, index) => (
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
                          <option value={resumes._id}>
                            {resumes.personalInfo?.name || resumes.resume_title || "Your Resume"}
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <button 
                      onClick={() => selectPost(post)}
                      disabled={!selectedResumeId}
                      className={`w-full flex items-center justify-center gap-2 text-sm text-white bg-blue-600 py-2 px-4 rounded-md transition-colors ${
                        !selectedResumeId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      <Send size={16} />
                      Generate Email
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Email generation modal */}
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
              className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
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
                      {selectedPost.extractedEmails[0]}
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
                        <option value={resumes._id}>
                          {resumes.personalInfo?.name || resumes.resume_title || "Your Resume"}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailPage;
