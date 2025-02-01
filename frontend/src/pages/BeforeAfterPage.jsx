import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import Stack from "../components/Stack";
import SplitText from "../components/SplitText";
import FileUploader from "../components/FileUploader";
import axios from "axios";
import Footer from "../components/Footer";

const BeforeAfterPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null); // State to track selected template
  const api = import.meta.env.VITE_API_URL;

  const images = [
    { id: 1, img: "https://res.cloudinary.com/dkb1rdtmv/image/upload/v1738440045/v1_wrpqtm.png", template: "v1" },
    { id: 2, img: "https://res.cloudinary.com/dkb1rdtmv/image/upload/v1738440050/v2_aw24xg.png", template: "v2" },
    // { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format", template: "v3" },
    // { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format", template: "v4" },
  ];

  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template);
    console.log("Selected template:", template);
  };

  const handleFileUpload = async (uploadResponse) => {
    try {
      console.log("Upload successful:", uploadResponse);
    } catch (error) {
      console.error("Error handling upload response:", error);
      alert("Error processing the file");
    }
  };

  const handleAnimationComplete = () => {
    console.log("All letters have animated");
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 sm:mb-12">
          <SplitText
            text="ResumeTex"
            className="text-3xl sm:text-4xl font-bold text-center text-black mb-4"
            delay={100}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <p className="text-lg sm:text-xl text-gray-600 px-2 sm:px-4">
            Transforming Simple PDFs into Professional LaTeX Resumes Effortlessly!
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 mb-8 sm:mb-12">
          <div className="relative w-[200px] sm:w-[250px] h-[320px] sm:h-[400px] transform -rotate-3">
            <img
              src="https://cdn-images.zety.com/templates/zety/enfold-18-duo-blue-navy-1165@1x.png"
              alt="Before"
              className="w-full h-full object-fit rounded-lg shadow-lg"
            />
            <span className="absolute bottom-4 left-4 bg-[#2563EB] text-white px-2 py-1 rounded text-sm font-semibold">
              Before
            </span>
          </div>

          <ArrowRightIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 rotate-90 md:rotate-0" />

          <div className="relative transform rotate-3">
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ 
                width: window.innerWidth < 640 ? 220 : 270, 
                height: window.innerWidth < 640 ? 340 : 420 
              }}
              cardsData={images}
              onTemplateSelect={handleTemplateSelection}
            />
          </div>
        </div>

        <div className="flex justify-center w-full px-2 sm:px-4">
          <FileUploader 
            onFileUpload={handleFileUpload}
            apiUrl={api}
            template={selectedTemplate}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default BeforeAfterPage;
