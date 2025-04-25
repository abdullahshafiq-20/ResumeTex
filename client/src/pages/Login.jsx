import React from "react";

export default function LoginPage() {
  const handleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-scre px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to ResumeTex</h1>
      <p className="mb-6 text-lg text-gray-400">Login to continue</p>

      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
      >
        Continue with Google
      </button>
    </div>
  );
}
