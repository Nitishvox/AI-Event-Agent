
import React from 'react';
import type { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
}

const renderMarkdown = (text: string) => {
  // A very simple markdown to html converter for bold text.
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>');
  return html;
};


export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div className="glass-card p-6 rounded-xl shadow-lg animate-fade-in">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          {React.cloneElement(plan.icon, { className: 'w-6 h-6 text-indigo-300' })}
        </div>
        <h3 className="text-xl font-bold text-indigo-300">{plan.title}</h3>
      </div>
      <div 
        className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(plan.content) }}
      />
      <style>{`
        .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert strong { color: #c7d2fe; }
        .prose-invert ul > li::before { background-color: #818cf8; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};