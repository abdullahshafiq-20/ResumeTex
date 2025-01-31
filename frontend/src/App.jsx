import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Squares from "./components/background/Squares";
import SplitText from "./components/SplitText";
import BeforeAfterPage from "./pages/BeforeAfterPage";
import ResponsePage from "./pages/ResponsePage";
import FileUploader from "./components/FileUploader";

import "./App.css";

export default function App() {
  
  
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="app-container">
      <div className="background-layer">
        <Squares
          speed={0.1}
          squareSize={30}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="rgba(0, 0, 0, 0.01)"
          hoverFillColor="rgba(0, 0, 0, 0.03)"
        />
      </div>
      <div className="content-layer flex flex-col items-center justify-center min-h-screen">
        <Routes>
          <Route path="/" element={<BeforeAfterPage />} />
          <Route path="/response" element={<ResponsePage />} />
        </Routes>
      </div>
    </div>
  );
}
