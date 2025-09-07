import React, { useState } from 'react';
import { Loader } from './Loader';

interface PromptInputProps {
  onPlan: (idea: string) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onPlan, isGenerating }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlan(idea);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 glass-card p-6 rounded-2xl shadow-lg">
      <label htmlFor="event-idea" className="block text-sm font-medium leading-6 text-gray-200">
        What's your event idea?
      </label>
      <div className="mt-2">
        <textarea
          rows={4}
          name="event-idea"
          id="event-idea"
          className="block w-full rounded-md border-0 bg-white/5 p-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-400"
          placeholder="e.g., A futuristic tech conference for 500 people in San Francisco."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isGenerating}
        />
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          disabled={isGenerating || !idea.trim()}
          className="flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader />
              Planning...
            </>
          ) : (
            'Plan My Event'
          )}
        </button>
      </div>
    </form>
  );
};