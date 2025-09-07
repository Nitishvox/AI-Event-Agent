
import React, { useState } from 'react';
import type { Plan } from '../types';

interface FinalPlanDisplayProps {
  plan: Plan;
  onReset: () => void;
}

// A more capable markdown renderer for the final display
const renderMarkdown = (text: string) => {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-indigo-200">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-white">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>');

  const lines = html.split('\n');
  let inList = false;
  html = lines.map(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const listItem = `<li>${trimmedLine.substring(2)}</li>`;
      if (!inList) {
        inList = true;
        return `<ul class="list-disc list-inside space-y-1 mt-2">${listItem}`;
      }
      return listItem;
    } else {
      if (inList) {
        inList = false;
        return `</ul><p class="mt-2">${line}</p>`;
      }
      return line;
    }
  }).join('\n');
  
  if (inList) {
    html += '</ul>';
  }

  return html.replace(/\n/g, '<br />').replace(/<br \s*\/><(ul|li|h[1-3])/g, '<$1');
};


export const FinalPlanDisplay: React.FC<FinalPlanDisplayProps> = ({ plan, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(plan.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Event Plan: ${plan.title}</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; line-height: 1.6; color: #111; }
              h1,h2,h3 { color: #000; }
              strong { font-weight: 600; }
              ul { padding-left: 20px; }
            </style>
          </head>
          <body>
            <h1>Event Plan</h1>
            <div id="content"></div>
          </body>
        </html>
      `);
      // Use DOM manipulation to avoid script injection issues
      const contentDiv = printWindow.document.getElementById('content');
      if (contentDiv) {
        contentDiv.innerHTML = renderMarkdown(plan.content).replace(/<br\s*\/?>/gi, '');
      }
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };


  return (
    <div className="mt-10 glass-card p-6 sm:p-8 rounded-2xl shadow-2xl shadow-indigo-500/10 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30 shrink-0">
          {React.cloneElement(plan.icon, { className: 'w-8 h-8 text-indigo-300' })}
        </div>
        <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Your Complete Event Plan</h2>
            <p className="text-indigo-300 text-sm mt-1">Everything you need, from ideation to execution.</p>
        </div>
      </div>

      <div 
        className="prose prose-invert max-w-none text-gray-300 space-y-4"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(plan.content) }}
      />
      
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center gap-x-4">
            <button
                onClick={handleCopy}
                title="Copy plan to clipboard"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-x-2 rounded-md bg-gray-700/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-colors"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy Plan
                </>
              )}
            </button>
            <button
                onClick={handlePrint}
                title="Print this plan"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-x-2 rounded-md bg-gray-700/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-4a1 1 0 011-1h2a1 1 0 011 1v4h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
              Print Plan
            </button>
        </div>
        <button 
            onClick={onReset}
            className="w-full sm:w-auto rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-colors"
        >
            Plan Another Event
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};