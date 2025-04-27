import React, { useState, useEffect } from 'react';
import { Eye, PencilLine, Download, Trash2, MoreVertical, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const MyResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - replace with your API fetch call
  useEffect(() => {
    // Simulate fetching resume data from API
    setTimeout(() => {
      setResumes([
        {
          id: 1,
          name: 'My Professional Resume',
          pdfUrl: 'https://example.com/resume1.pdf',
          size: '256 KB',
          lastModified: '2025-04-01',
          tags: ['Professional', 'Technical']
        },
        {
          id: 2,
          name: 'Academic CV',
          pdfUrl: 'https://example.com/resume2.pdf',
          size: '412 KB',
          lastModified: '2025-03-15',
          tags: ['Academic', 'Research']
        },
        {
          id: 3,
          name: 'Simple One-Pager',
          pdfUrl: 'https://example.com/resume3.pdf',
          size: '128 KB',
          lastModified: '2025-02-20',
          tags: ['Simple', 'Brief']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleView = (resumeId, pdfUrl) => {
    console.log(`Viewing resume ${resumeId}`);
    window.open(pdfUrl, '_blank');
  };

  const handleEdit = (resumeId) => {
    console.log(`Editing resume ${resumeId}`);
    // Implement edit functionality
  };

  const handleDownload = (resumeId, pdfUrl) => {
    console.log(`Downloading resume ${resumeId}`);
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `resume-${resumeId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (resumeId) => {
    console.log(`Deleting resume ${resumeId}`);
    // Implement delete functionality with confirmation
    if (window.confirm('Are you sure you want to delete this resume?')) {
      setResumes(resumes.filter(resume => resume.id !== resumeId));
    }
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading your resumes...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.h2 
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Resumes
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {resumes.map((resume) => (
          <motion.div 
            key={resume.id} 
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            variants={itemVariants}
            whileHover="hover"
          >
            {/* PDF Tag with Name - No Preview */}
            <div className="bg-gray-50 flex items-center p-4 border-b border-gray-100">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-red-500" strokeWidth={2} />
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-medium text-base text-gray-800 truncate" title={resume.name}>
                  {resume.name}
                </h3>
                <p className="text-xs text-gray-500">PDF Document</p>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-4">              
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{resume.size}</span>
                <span>Modified: {resume.lastModified}</span>
              </div>
              
              <div className="mb-4 flex flex-wrap">
                {resume.tags.map((tag, index) => (
                  <motion.span 
                    key={index} 
                    className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
                    whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <motion.button 
                  onClick={() => handleView(resume.id, resume.pdfUrl)}
                  className="flex items-center px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-md"
                  whileHover={{ backgroundColor: "#ebf5ff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="mr-1 h-4 w-4" /> View
                </motion.button>
                
                <motion.button 
                  onClick={() => handleEdit(resume.id)}
                  className="flex items-center px-3 py-1.5 text-sm border border-gray-500 text-gray-600 rounded-md"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PencilLine className="mr-1 h-4 w-4" /> Edit
                </motion.button>
                
                {/* More Options Dropdown */}
                <div className="relative group">
                  <motion.button 
                    className="flex items-center px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreVertical className="text-gray-600 h-4 w-4" />
                  </motion.button>
                  
                  {/* Dropdown Menu */}
                  <motion.div 
                    className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-20 invisible group-hover:visible"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => handleDownload(resume.id, resume.pdfUrl)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {resumes.length === 0 && !loading && (
        <motion.div 
          className="text-center py-10 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No resumes found. Create your first resume to get started.
        </motion.div>
      )}
    </>
  );
};

export default MyResume;