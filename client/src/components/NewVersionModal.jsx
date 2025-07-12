import React, { useRef, useEffect, useState } from 'react';
import { X, Rocket, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const NewVersionModal = ({ isOpen, onClose, onSwitchToNewVersion }) => {
  const modalRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Steps data with images and descriptions
  const steps = [
    {
      id: 1,
      title: "Welcome to New ResumeTex",
      description: "Sign up and get started with our automated job application system. Create your account and grant Gmail permissions for seamless integration.",
      image: "https://res.cloudinary.com/dlthjlibc/image/upload/v1752312129/477shots_so_dc0tmv.jpg",
      highlight: "🚀 Fully Automated Job Applications"
    },
    {
      id: 2,
      title: "Upload Your Resume",
      description: "Create or upload your resume and give it a professional title. Our system will optimize it for better job matching.",
      image: "https://res.cloudinary.com/dlthjlibc/image/upload/v1752312129/454shots_so_zbnhvn.jpg",
      highlight: "📄 Smart Resume Processing"
    },
    {
      id: 3,
      title: "Set Preferences",
      description: "Configure your skills preferences once - summary profile, projects and more. These settings will be used for all applications.",
      image: "https://res.cloudinary.com/dlthjlibc/image/upload/v1752312130/674shots_so_fm7hnl.jpg",
      highlight: "⚙️ Set Once, Apply Everywhere"
    },
    {
      id: 4,
      title: "LinkedIn Job Post",
      description: "Paste a job post link here, and our system will match it with your profile to generate a personalized Gmail email for you to send.",
      image: "https://res.cloudinary.com/dlthjlibc/image/upload/v1752312129/987shots_so_cwdhec.jpg",
      highlight: "🔗 LinkedIn Job Post"
    },
    {
      id: 5,
      title: "Auto-Generated Emails",
      description: "Let ResumeTex auto-generate personalized Gmail emails for each job application. Review and customize before sending.",
      image: "https://res.cloudinary.com/dlthjlibc/image/upload/v1752312129/446shots_so_a9cdc5.jpg",
      highlight: "✉️ Personalized Email Generation"
    },
    {
      id: 6,
      title: "Jobs Page - One Click Apply",
      description: "Browse personalized, matched jobs on our Jobs Page. Review the match, click apply, and send - all in one click. No more manual work!",
      image: "https://res.cloudinary.com/dlthjlibc/image/upload/v1752312130/905shots_so_pvjvld.jpg",
      highlight: "✅ Review → Click → Apply"
    }
  ];

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-sm sm:max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-3 sm:p-4 pb-2 sm:pb-3 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
          
          <div className="flex items-center space-x-2 mb-1">
            {/* <div className="p-1 sm:p-1.5 bg-blue-100 rounded-full">
              <Rocket size={14} className="text-blue-600" />
            </div> */}
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
            🎉 ResumeTex 2.0 is Here!
            </h2>
          </div>
          
          <p className="text-gray-600 text-xs">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col overflow-y-auto">
          {/* Step Image */}
          <div className="flex-shrink-0 mb-3">
            <div className="relative w-full h-64 sm:h-80 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={currentStepData.image}
                alt={currentStepData.title}
                className="w-full h-full object-fit"
              />
              <div className="absolute top-1.5 left-1.5 bg-white bg-opacity-90 px-1.5 py-0.5 rounded-full">
                <span className="text-xs font-medium text-gray-700">
                  {currentStepData.highlight}
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
              {currentStepData.description}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-1.5 mt-3 mb-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-xs text-gray-500">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentStep === steps.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 pt-2 sm:pt-3 border-t flex-shrink-0">
          <div className="flex flex-col gap-2">
            <button
              onClick={onSwitchToNewVersion}
              className="w-full bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Rocket size={12} />
              <span>Switch to ResumeTex 2.0</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Continue with Current Version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVersionModal; 