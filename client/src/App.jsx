import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Squares from "./components/background/Squares";
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import "./App.css";
import AdSenseScriptLoader from "./components/AdSenseScriptLoader";

// Lazy load components
const BeforeAfterPage = lazy(() => import("./pages/BeforeAfterPage"));
const ResponsePage = lazy(() => import("./pages/ResponsePage"));
const BugReportPage = lazy(() => import("./pages/BugReportPage"));
const DocumentationPage = lazy(() => import("./pages/DocumentationPage"));
const EditorPage = lazy(() => import("./pages/EditorPage"));

export default function App() {
  return (
    <>
      <HelmetProvider>
      <AdSenseScriptLoader />
      <Toaster />
      <Analytics />
      <div className="app-container">
        <div className="background-layer">
          <Squares speed={0.1} squareSize={30} direction="diagonal" borderColor="rgba(0, 0, 0, 0.01)" hoverFillColor="#2563EB" />
        </div>
        <div className="content-layer flex flex-col items-center justify-center min-h-screen">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<BeforeAfterPage />} />
              <Route path="/response" element={<ResponsePage />} />
              <Route path="/bug-report" element={<BugReportPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/editor" element={<EditorPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      </HelmetProvider>
    </>
  );
}