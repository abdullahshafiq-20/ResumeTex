"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomPDFViewer from "../components/CustomPdfViewer";

export default function ResponsePage() {
  const [activeTab, setActiveTab] = useState("pdf");
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(
    "https://res.cloudinary.com/dkb1rdtmv/raw/upload/v1738070352/blox74khdoyzhpdc7x30.pdf"
  );

  const sampleLatexCode = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{empty}{fullpage}
\\usepackage{titlesec}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4">
      <div className="flex flex-col items-start">
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Your Resume is Ready
          </h1>
          <p className="text-gray-600 text-center text-sm max-w-2xl mx-auto">
            Your resume has been transformed into LaTeX format. You can view the
            PDF preview or access the LaTeX code below.
          </p>
        </div>

        <div className="w-full">
          {/* Navigation Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Convert Another Resume
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 mb-4 border rounded-md overflow-hidden">
            <button
              className={`py-2.5 text-sm font-medium transition-colors ${
                activeTab === "pdf"
                  ? "bg-white border-b-2 border-blue-500"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("pdf")}
            >
              Rendered PDF
            </button>
            <button
              className={`py-2.5 text-sm font-medium transition-colors ${
                activeTab === "latex"
                  ? "bg-white border-b-2 border-blue-500"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("latex")}
            >
              LaTeX Code
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200">
            {activeTab === "pdf" ? (
              <div className="p-3">
                <div className="flex justify-end mb-3">
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => window.open(pdfUrl, "_blank")}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
                <CustomPDFViewer pdfUrl={pdfUrl} />
              </div>
            ) : (
              <div className="p-3">
                <div className="flex justify-end gap-2 mb-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open in Overleaf
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Code
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto font-mono text-sm">
                  <code>{sampleLatexCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
