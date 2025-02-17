import React, { useEffect } from "react";
import { auth, provider, signInWithPopup } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CircleImage from "../assets/images/circles_bg.png";
import GoogleIcon from "../assets/images/google.png";
import TaskImage from "../assets/images/TaskImage.jpeg";

// @ts-ignore
const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      auth.onAuthStateChanged(() => {}); 

      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-[#F9F6F5] items-center justify-center text-center md:text-left">
      {/* Background Circles */}
      <img
        src={CircleImage}
        alt="Background Circle"
        className="absolute top-[-50px] left-[-50px] w-48 md:w-64 opacity-50 z-[-1]"
      />
      <img
        src={CircleImage}
        alt="Background Circle"
        className="absolute bottom-[-50px] right-[-50px] w-48 md:w-64 opacity-50 z-[-1]"
      />

      {/* Left Side - Logo & Text */}
      <div className="flex flex-col items-center md:items-start justify-center px-6 md:px-16 lg:px-24 max-w-lg">
        <h1 className="text-4xl font-extrabold text-[#6D28D9] flex items-center gap-2">
          <span className="text-5xl">📋</span> TaskBuddy
        </h1>
        <p className="text-gray-600 mt-4 text-base px-4 max-w-xs md:max-w-full">
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleSignIn}
          className="mt-6 flex items-center justify-center gap-3 px-6 py-3 bg-black text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
        >
          <img src={GoogleIcon} alt="Google Icon" className="w-6 h-6" />
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden md:flex items-center justify-center w-1/2 relative">
        <img
          src={TaskImage}
          alt="Task Manager UI"
          className="relative w-[85%] max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-auto rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default Auth;
