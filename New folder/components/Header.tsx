import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="relative group text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
        Event Genesis AI
        <span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></span>
        <span className="relative">Event Genesis AI</span>
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-300">
        Your agentic AI partner for flawless event planning. Just share your idea, and let our AI agent handle the rest, one step at a time.
      </p>
    </header>
  );
};