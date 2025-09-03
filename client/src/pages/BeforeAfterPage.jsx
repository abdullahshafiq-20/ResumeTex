import { useState, useEffect } from "react";
import { ArrowRightIcon } from "lucide-react";
import Stack from "../components/Stack";
import SplitText from "../components/SplitText";
import FileUploader from "../components/FileUploader";
import axios from "axios";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import CountUp from "../components/CountUp";
import { Bug, FileText, CircleFadingArrowUp, Rocket } from "lucide-react";
import NewVersionModal from "../components/NewVersionModal";

const BeforeAfterPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [serverStatus, setServerStatus] = useState("loading");
  const api = import.meta.env.VITE_API_URL;
  const api_1 = import.meta.env.VITE_API_URL_1;
  const [deploymentLog, setDeploymentLog] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(false);
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);

  // Status styles configuration
  const statusConfig = {
    up: {
      dotColor: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      text: "Server Online",
    },
    loading: {
      dotColor: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      text: "Checking Status...",
    },
    down: {
      dotColor: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      text: "Server Offline",
    },
  };

  // Check server status and show modal on first visit
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${api_1}/`);
        if (response.status === 200) {
          setServerStatus("up");
        } else {
          setServerStatus("down");
        }
        const countResponse = await axios.get(`${api}/getCount`);
        setCount(countResponse.data.count);
      } catch (error) {
        console.error("Server check failed:", error);
        setServerStatus("down");
      }
    };

    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem('hasSeenNewVersionModal');
    if (!hasSeenModal) {
      // Show modal after a short delay
      setTimeout(() => {
        setShowNewVersionModal(true);
      }, 1000);
    }

    // Initial check
    checkServerStatus();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [api]);

  // Get current status configuration
  const currentStatus = statusConfig[serverStatus];

  const images = [
    {
      id: 2,
      img: "https://res.cloudinary.com/dlthjlibc/image/upload/v1740654640/Screenshot_2025-02-27_160731_dkzmst.png",
      template: "v2",
    },
  ];

  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template);
  };

  const handleFileUpload = async (uploadResponse) => {
    try {
      setDeploymentLog({
        type: "success",
        message: "File uploaded successfully! Processing your resume...",
      });
    } catch (error) {
      console.error("Error handling upload response:", error);
      setDeploymentLog({
        type: "danger",
        message: "Error processing the file. Please try again.",
      });
    }
  };

  const handleAnimationComplete = () => {
    // Animation complete handler
  };

  const handleCloseModal = () => {
    setShowNewVersionModal(false);
    // localStorage.setItem('hasSeenNewVersionModal', 'true');
  };

  const handleSwitchToNewVersion = () => {
    // You can redirect to the new version URL here
    window.open('https://resume-tex-cyan.vercel.app/login', '_blank');
    handleCloseModal();
  };

  const handleShowNewVersionModal = () => {
    setShowNewVersionModal(true);
  };

  return (
    <>
      <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 flex items-center justify-center relative">
        {/* Enhanced Server Status Indicator */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2">
          <div
            className={`
          flex items-center gap-1.5 sm:gap-2 
          ${currentStatus.bgColor}
          ${currentStatus.textColor}
          border ${currentStatus.borderColor}
          rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 
          transition-all duration-300 ease-in-out
        `}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`
              w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full 
              ${currentStatus.dotColor}
              ${serverStatus === "loading" ? "animate-pulse" : ""}
            `}
              />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {currentStatus.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/documentation")}
            className="flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 ease-in-out"
          >
            <FileText size={16} className="sm:w-5 sm:h-5" />
            <span>Documentation</span>
          </button>
          <button
            onClick={() => navigate("/bug-report")}
            className="flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-700 hover:bg-red-100 transition-all duration-300 ease-in-out"
          >
            <Bug size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Report Bug</span>
          </button>
        </div>

        {/* New Version Button - Top Left */}
        {/* <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <button
            onClick={handleShowNewVersionModal}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Rocket size={16} className="sm:w-5 sm:h-5" />
            <span>Switch to New Version</span>
          </button>
        </div> */}

        <div className="max-w-4xl w-full mt-10 sm:mt-16">
          <div className="text-center mb-6 sm:mb-10">
            <div className="flex items-start justify-center">
              <SplitText
                text="ResumeTex"
                className="text-2xl sm:text-4xl font-bold text-center text-black mb-3 sm:mb-4"
                delay={100}
                animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
                onLetterAnimationComplete={handleAnimationComplete}
              />
              <div className="relative group">
                <CircleFadingArrowUp
                  size={24}
                  className="text-blue-500 cursor-help"
                />
                <div className="absolute left-full   mb-2 transform -translate-x-1/2 hidden group-hover:block bg-black bg-opacity-80 text-white text-xs rounded py-1 px-2 min-w-[150px] z-10">
                  New feature! coming soon.
                  You may get a live editor to create your resume.
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-lg text-gray-600 px-2 sm:px-4 mt-3 sm:mt-4">
              Transforming Simple PDFs into Professional LaTeX Resumes
              Effortlessly!
            </p>

            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="border border-blue-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 inline-flex items-center">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-blue-600 font-medium mb-0.5 sm:mb-1">
                    Successful Conversions
                  </p>
                  <div className="flex items-center justify-center">
                    <CountUp
                      from={0}
                      to={count}
                      separator=","
                      duration={2}
                      className="text-xl sm:text-3xl font-bold text-blue-700"
                    />
                    <span className="text-xl sm:text-3xl font-bold text-blue-700 ml-0.5 sm:ml-1">
                      +
                    </span>
                  </div>
                  <p className="text-2xs sm:text-xs text-blue-500 mt-0.5 sm:mt-1">
                    Happy users and counting!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 sm:space-y-8 md:space-y-0 md:space-x-6 sm:md:space-x-8 mb-6 sm:mb-10">
            <div className="relative w-[180px] sm:w-[250px] h-[290px] sm:h-[400px] transform -rotate-3">
              <img
                src="https://cdn-images.zety.com/templates/zety/enfold-18-duo-blue-navy-1165@1x.png"
                alt="Before"
                className="w-full h-full object-fit rounded-lg shadow-lg"
              />
              <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-[#2563EB] text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
                Before
              </span>
            </div>

            <ArrowRightIcon className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400 rotate-90 md:rotate-0" />

            <div className="relative transform rotate-3">
              <Stack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={false}
                cardDimensions={{
                  width: window.innerWidth < 640 ? 200 : 270,
                  height: window.innerWidth < 640 ? 310 : 420,
                }}
                cardsData={images}
                onTemplateSelect={handleTemplateSelection}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-2 sm:px-4">
            <div className="w-full">
              <div className="w-full max-w-[500px] mx-auto mb-3 sm:mb-4 border border-yellow-300 rounded-lg px-4 sm:px-6 py-2 sm:py-3 bg-yellow-50 text-center">
                {disable ? (
                  <p className="text-xs sm:text-sm text-yellow-600 ">
                    The server is currently undergoing scheduled maintenance. We expect to complete the process shortly. We appreciate your patience and apologize for any inconvenience caused.
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-yellow-600">
                    Note: In some cases, the PDF may not be generated. If this
                    occurs, please try converting again.
                  </p>
                )}
              </div>
            </div>

            <FileUploader
              onFileUpload={handleFileUpload}
              apiUrl={api}
              template={selectedTemplate}
              disable={disable}
            />
          </div>

          <Footer />
        </div>
      </div>

      {/* New Version Modal */}
      <NewVersionModal
        isOpen={showNewVersionModal}
        onClose={handleCloseModal}
        onSwitchToNewVersion={handleSwitchToNewVersion}
      />
    </>
  );
};

export default BeforeAfterPage;
