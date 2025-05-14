import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";
import { PostsProvider } from "./context/PostsContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PostsProvider>
        <ResumeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ResumeProvider>
      </PostsProvider>
    </AuthProvider>
  </React.StrictMode>
);
