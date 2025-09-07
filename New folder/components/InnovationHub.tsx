import React, { useState, useCallback } from 'react';
import { getFeatureRecommendations } from '../services/groqService';
import type { Recommendation } from '../types';
import { Loader } from './Loader';

interface InnovationHubProps {
  planContext: string;
}

const TechIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v7.5A2.25 2.25 0 0 0 6.75 18Z" />
  </svg>
);

const ExperienceIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.25a14.98 14.98 0 0 0-5.96 12.12c0 3.193.986 6.227 2.75 8.72v-4.8m3.21-4.18a6 6 0 0 1 5.84-7.38v4.8" />
  </svg>
);

const EngagementIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const iconMap = {
  Tech: <TechIcon />,
  Experience: <ExperienceIcon />,
  Engagement: <EngagementIcon />,
};

export const InnovationHub: React.FC<InnovationHubProps> = ({ planContext }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFeatureRecommendations(planContext);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [planContext]);

  return (
    <div className="mt-12 glass-card p-6 sm:p-8 rounded-2xl shadow-2xl shadow-purple-500/10 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Innovation Hub</h2>
        <p className="mt-2 text-purple-300">Ready to take your event to the next level? Let's innovate.</p>
      </div>

      {recommendations.length === 0 && !isLoading && !error && (
        <div className="mt-8 text-center">
          <button
            onClick={handleGenerate}
            className="rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all transform hover:scale-105"
          >
            Suggest Cutting-Edge Features
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 flex justify-center items-center space-x-3 text-gray-300">
          <Loader />
          <span>Consulting with our AI Innovation Strategist...</span>
        </div>
      )}

      {error && (
         <div className="mt-8 text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="glass-card p-6 rounded-xl border-purple-500/20">
              <div className="flex items-center space-x-3 text-purple-300">
                {iconMap[rec.icon] || <ExperienceIcon />}
                <h3 className="font-semibold">{rec.title}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-300">{rec.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};