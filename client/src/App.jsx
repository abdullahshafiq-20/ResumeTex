import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Squares from "./components/background/Squares";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import PrivateRoute from "./utils/PrivateRoute";
import AuthCallback from "./pages/AuthCallback";
import LoginPage from "./pages/Login";
import Dashbaord from "./pages/Dashbaord";
import TestPage from "./pages/TestPage";
import OnBoardPage from "./pages/OnBoardPage";
import MyResume from "./pages/MyResume";
import DashboardLayout from "./layouts/DashboardLayout";

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
        <Toaster />
        <Analytics />
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={<BeforeAfterPage />} />
            <Route path="/response" element={<ResponsePage />} />
            <Route path="/bug-report" element={<BugReportPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/onboard" element={<PrivateRoute><OnBoardPage /></PrivateRoute>} />
            
            {/* Protected routes with Dashboard layout */}
            <Route 
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<Dashbaord />} />
              <Route path="my-resume" element={<MyResume />} />
              <Route path="editor" element={<EditorPage />} />
              {/* Add more dashboard routes here */}
            </Route>

          </Routes>
        </Suspense>
      </HelmetProvider>
    </>
  );
}
