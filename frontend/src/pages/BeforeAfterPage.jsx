import { ArrowRightIcon } from "lucide-react"
import Stack from "../components/Stack"
import SplitText from "../components/SplitText"
import FileUploader from "../components/FileUploader"

const BeforeAfterPage = () => {
  const images = [
    { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
    { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
    { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
    { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" },
  ]

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === "application/pdf") {
      // Handle PDF upload
      console.log("PDF uploaded:", file.name)
    } else {
      alert("Please upload a PDF file")
    }
  }

    const handleAnimationComplete = () => {
    console.log("All letters have animated");
    };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <SplitText
            text="Hello, Tailwind!"
            className="text-4xl font-bold text-center text-black mb-4"
            delay={100}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <p className="text-xl text-gray-600 px-4">Experience the power of our image processing technology</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 mb-12">
          <div className="relative w-[250px] h-[400px] transform -rotate-3">
            <img
              src="https://cdn-images.zety.com/templates/zety/cascade-3-duo-blue-navy-21@1x.png"
              alt="Before"
              className="w-full h-full object-fit rounded-lg shadow-lg"
            />
            <span className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded text-sm font-semibold">Before</span>
          </div>

          <ArrowRightIcon className="w-12 h-12 text-gray-400 rotate-90 md:rotate-0" />

          <div className="relative transform rotate-3">
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 250, height: 400 }}
              cardsData={images}
            />
            <span className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold">After</span>
          </div>
        </div>

        <div className="flex justify-center w-full px-4">
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  )
}

export default BeforeAfterPage

