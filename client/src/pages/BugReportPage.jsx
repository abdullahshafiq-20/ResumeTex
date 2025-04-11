import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BugReportPage = () => {
    const navigate = useNavigate();
    
    const api = import.meta.env.VITE_API_URL;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        console.log("Form submitted:", formData);
        const response = await axios.post(`${api}/bugForm`, formData);
        if (response.status === 200) {
          toast.success("Bug report submitted successfully!", {
            position: 'bottom-center',
            duration: 5000,
          });
          setFormData({
            name: "",
            email: "",
            message: "",
          });
        } else {
          alert("Error submitting bug report. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to submit bug report. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    return (
      <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <div className="flex items-center mb-4 sm:mb-6">
              <button
                onClick={() => navigate("/")}
                className="mr-3 sm:mr-4 p-1.5 sm:p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <ChevronLeft size={20} className="sm:w-5 sm:h-5" />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Report a Bug</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
              Help us improve by reporting any issues you encounter
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div className="rounded-md shadow-sm space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] focus:z-10 text-xs sm:text-sm"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] focus:z-10 text-xs sm:text-sm"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] focus:z-10 text-xs sm:text-sm"
                  placeholder="Describe the issue you encountered"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-[#2563EB] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default BugReportPage;