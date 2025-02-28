import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, AlertCircle, Check, X, InfoIcon } from "lucide-react";
import Footer from "../components/Footer";

const DocumentationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 sm:mb-10">
          <button
            onClick={() => navigate("/")}
            className="mr-3 sm:mr-4 p-1.5 sm:p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <ChevronLeft size={20} className="sm:block" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            ResumeTex Documentation
          </h1>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <FileText className="mr-2 text-blue-600" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Project Overview
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            ResumeTex is an AI-powered tool that converts standard PDF resumes into 
            professionally formatted LaTeX documents. Our service helps you create 
            elegant, structured resumes without needing to learn LaTeX syntax.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
            <div className="flex">
              <InfoIcon className="text-blue-500 mr-2 flex-shrink-0" size={18} />
              <p className="text-xs sm:text-sm text-blue-700">
                Our goal is to democratize access to professional typesetting for everyone, 
                making it simple to create beautiful resumes that stand out.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Key Features</h2>
          <ul className="space-y-2 sm:space-y-3">
            {[
              "PDF to LaTeX conversion with AI-powered formatting",
              "Multiple professional resume templates",
              "Preserves your resume structure and content",
              "Download both LaTeX source files and compiled PDFs",
              "No LaTeX knowledge required",
              "100% free to use"
            ].map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">How to Use</h2>
          <ol className="space-y-3 sm:space-y-4">
            <li className="flex">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-xs sm:text-sm">1</span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-800">Upload your resume</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Upload your existing resume in PDF format. The clearer the format, the better the results.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-xs sm:text-sm">2</span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-800">Select a template</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Choose from our collection of professional LaTeX resume templates.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-xs sm:text-sm">3</span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-800">Process and download</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Our AI converts your resume to LaTeX format. Download both the LaTeX source files and the compiled PDF.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Limitations & Restrictions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <AlertCircle className="mr-2 text-amber-500" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Limitations & Restrictions
            </h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="border-l-4 border-amber-500 pl-3 sm:pl-4 py-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800">File Size Limit</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Maximum file size: 10MB per upload
              </p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-3 sm:pl-4 py-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800">Supported Formats</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Currently only PDF files are supported for upload
              </p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-3 sm:pl-4 py-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800">Complex Formatting</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Very complex layouts, tables, or unusual formatting might not convert perfectly
              </p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-3 sm:pl-4 py-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800">Language Support</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Best results with English-language resumes; limited support for other languages
              </p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-3 sm:pl-4 py-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800">Known Issues</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                PDF may not be produced in some cases. If that happens, please try again or report the issue via the bug report button.
              </p>
            </div>
          </div>
        </div>

        {/* Tips for Best Results */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Tips for Best Results</h2>
          <ul className="space-y-2 sm:space-y-3">
            {[
              "Use clean, well-structured PDF files for best conversion accuracy",
              "Avoid unusual formatting, text boxes, and complex graphics",
              "Ensure your PDF is text-based (not scanned images)",
              "Standard section headings (Experience, Education, Skills) work best",
              "Consider using bullet points for better structure recognition"
            ].map((tip, index) => (
              <li key={index} className="flex items-start">
                <InfoIcon className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-xs sm:text-sm text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: "Is this service completely free?",
                a: "Yes, ResumeTex is currently free to use for all users."
              },
              {
                q: "Do I need to know LaTeX to use this tool?",
                a: "Not at all! Our tool handles all the LaTeX coding for you. You just upload your current resume."
              },
              {
                q: "Will my personal data be stored?",
                a: "We do not store your resume content. Files are processed temporarily and then deleted from our servers."
              },
              {
                q: "Can I edit the generated LaTeX code?",
                a: "Yes, you can download the LaTeX source files and customize them further if you're familiar with LaTeX."
              },
              {
                q: "What if the conversion doesn't look right?",
                a: "Try uploading a cleaner version of your resume or report the issue using our bug reporting feature."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-0 last:pb-0">
                <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-1">
                  {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Contact & Support</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Encounter any issues or have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/bug-report')}
              className="bg-amber-500 hover:bg-amber-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center transition-colors text-xs sm:text-sm"
            >
              <AlertCircle size={16} className="mr-2" />
              Report a Bug
            </button>
            <a
              href="mailto:resumetex.convertor@gmail.com"
              className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center transition-colors text-xs sm:text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DocumentationPage;