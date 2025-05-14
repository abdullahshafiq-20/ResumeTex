import React from "react";
import { motion } from "framer-motion";
import FileUploader from "../components/FileUploader";
import PDFCard from "../components/PdfCard";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useResumes } from "../context/ResumeContext";
import { useEffect } from "react";
import { use } from "react";
import api from "../utils/api";

const MyResume = () => {
  // Demo data for resumes

  const { resumes } = useResumes();

  console.log("Resumes from context:", resumes);

  const demoResumes = [
    {
      _id: "1",
      title: "Software Engineer Resume",
      pdfUrl:
        "https://res.cloudinary.com/dlthjlibc/raw/upload/v1746795410/ykow4hjuecwtux7qglvl.pdf",
      imageUrl:
        "https://res.cloudinary.com/dlthjlibc/image/upload/v1746816884/resume_thumbnails/h7hxbsarrmctya9babdq.png",
      updatedAt: "2025-05-01T12:00:00Z",
    },
    {
      _id: "2",
      title: "Product Manager CV",
      pdfUrl:
        "https://res.cloudinary.com/dlthjlibc/raw/upload/v1746795410/ykow4hjuecwtux7qglvl.pdf",
      imageUrl:
        "https://res.cloudinary.com/dlthjlibc/image/upload/v1746816884/resume_thumbnails/h7hxbsarrmctya9babdq.png",
      updatedAt: "2025-04-28T14:30:00Z",
    },
    {
      _id: "3",
      title: "UX Designer Portfolio",
      pdfUrl:
        "https://res.cloudinary.com/dlthjlibc/raw/upload/v1746795410/ykow4hjuecwtux7qglvl.pdf",
      imageUrl:
        "https://res.cloudinary.com/dlthjlibc/image/upload/v1746816884/resume_thumbnails/h7hxbsarrmctya9babdq.png",
      updatedAt: "2025-05-05T09:15:00Z",
    },
    {
      _id: "4",
      title: "Project Manager Resume",
      pdfUrl:
        "https://res.cloudinary.com/dlthjlibc/raw/upload/v1746795410/ykow4hjuecwtux7qglvl.pdf",
      imageUrl:
        "https://res.cloudinary.com/dlthjlibc/image/upload/v1746816884/resume_thumbnails/h7hxbsarrmctya9babdq.png",
      updatedAt: "2025-05-08T16:45:00Z",
    },
  ];

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Resumes
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FileUploader
          apiUrl={api}
          template="v2"
          onFileUpload={(data) => console.log("File uploaded:", data)}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {resumes.map((resume) => (
          <motion.div
            key={resume._id}
            variants={itemVariants}
            whileHover="hover"
          >
            <PDFCard
              pdfUrl={resume.resume_link}
              imageUrl={resume.thumbnail}
              title={resume.resume_title}
              owner={`Modified: ${formatDate(resume.updatedAt)}`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MyResume;
