// Login.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useAuth } from "@/contexts/AuthContext";

export const Login = () => {
  const { loginWithGoogle, loading } = useAuth();

  const features = [
    "Track Every Penny",
    "Smart Budgeting Tools",
    "Detailed Financial Reports",
    "Secure Your Savings",
    "Gain Financial Clarity",
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = features[wordIndex];
    const typeSpeed = isDeleting ? 70 : 130;

    const handleTyping = () => {
      if (isDeleting) {
        setText((prev) => currentWord.substring(0, prev.length - 1));
      } else {
        setText((prev) => currentWord.substring(0, prev.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % features.length);
      }
    };

    const timer = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, features]);

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      {/* Updated container with red shadow glow for light theme */}
      <div className="w-full max-w-7xl mx-auto p-8 sm:p-16 rounded-2xl bg-background/80 dark:bg-black/20 border border-border shadow-lg dark:shadow-none shadow-red-500/20 light-glow-container backdrop-blur-sm">
        <Card className="w-full max-w-sm md:max-w-md mx-auto bg-transparent backdrop-blur-none border-none shadow-none">
          <CardHeader className="text-center flex flex-col items-center pt-6 sm:pt-0 pb-4">
            <div className="mb-3 text-4xl sm:text-5xl animate-pulse-emoji">
              💸
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Expense Tracker</h2>
            <p className="text-foreground/70 mt-2 text-sm sm:text-md">Your partner in financial mastery</p>
            <div className="h-10 mt-4 text-center">
              <span className="text-lg sm:text-xl font-medium text-primary dark:text-purple-300">{text}</span>
              <span className="animate-blink text-lg sm:text-xl font-medium text-primary dark:text-purple-300">|</span>
            </div>
            <p className="text-foreground/60 mt-4 text-xs sm:text-sm max-w-xs px-4">
              Take control of your money with intuitive tools and smart insights.
            </p>
          </CardHeader>
          <CardBody className="p-6 sm:p-8 pt-4 space-y-4">
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              isLoading={loading}
              onClick={loginWithGoogle}
              className="w-full font-semibold text-base sm:text-lg hover:scale-105 transition-transform bg-gradient-to-r from-blue-600 to-purple-600 text-white light-theme-button"
              startContent={
                !loading && (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 48 48">
                    <g>
                      <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 32.9 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 19.5-8.5 19.5-19.5 0-1.3-.1-2.5-.3-3.5z"/>
                      <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13.5 24 13.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4.5 24 4.5c-7.2 0-13.3 4.1-16.7 10.2z"/>
                      <path fill="#FBBC05" d="M24 45.5c5.6 0 10.5-1.9 14.3-5.1l-6.6-5.4c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.2-4.1-13-9.6l-7 5.4C6.7 41.1 14.7 45.5 24 45.5z"/>
                      <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-4.6 0-8.4-3.8-8.4-8.5s3.8-8.5 8.4-8.5c2.5 0 4.7.9 6.3 2.4l6.1-6.1C37.9 10.1 31.4 7.5 24 7.5c-8.3 0-15.3 6.7-15.3 15S15.7 37.5 24 37.5c7.4 0 13.9-2.6 18.1-7.1l-7-5.4C34.7 32.9 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4.5 24 4.5z"/>
                    </g>
                  </svg>
                )
              }
            >
              Sign in with Google
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};