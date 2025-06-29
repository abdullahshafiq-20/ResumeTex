import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";
import { PostsProvider } from "./context/PostsContext";
import { DashbaordProvider } from "./context/DashbaordContext";
import { SocketProvider } from "./context/SocketContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <PostsProvider>
        <DashbaordProvider>
          <ResumeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ResumeProvider>
        </DashbaordProvider>
          </PostsProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
