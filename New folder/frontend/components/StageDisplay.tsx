
import React from 'react';
import { STAGES } from '../constants';

interface StageDisplayProps {
  currentStageIndex: number;
}

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const WorkingSpinner: React.FC = () => (
    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.5A9.5 9.5 0 0 1 21.5 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);

export const StageDisplay: React.FC<StageDisplayProps> = ({ currentStageIndex }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-12 md:space-y-0 md:flex md:items-start">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = !isCompleted && !isCurrent;
          
          return (
            <li key={stage.title} className="relative md:flex-1">
              
              {/* Vertical connector on mobile */}
              {index !== STAGES.length - 1 && (
                <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-800 md:hidden" aria-hidden="true" />
              )}

              {/* Horizontal line on desktop, placed behind the content */}
              {index > 0 && (
                <div className="hidden md:block absolute right-1/2 top-5 h-0.5 w-full bg-gray-800" aria-hidden="true">
                    <div className={`h-full transition-all duration-500 ease-in-out ${isCompleted ? 'bg-green-500' : 'bg-gray-800'}`}/>
                </div>
              )}
              
              <div className="relative flex items-start space-x-4 md:flex-col md:items-center md:space-x-0 md:space-y-4 md:text-center">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out
                    ${isCompleted ? 'bg-green-500' : ''}
                    ${isCurrent ? 'bg-indigo-600 ring-4 ring-indigo-500/30 animate-pulse' : ''}
                    ${isPending ? 'border-2 border-gray-600 bg-gray-900' : ''}
                `}>
                    {isCompleted && <CheckIcon className="w-5 h-5 text-white" />}
                    {isCurrent && <WorkingSpinner />}
                    {isPending && React.cloneElement(stage.icon, { className: 'w-6 h-6 text-gray-500' })}
                </div>

                <div className="min-w-0 bg-gray-900 md:px-2">
                  <h3 className={`text-sm font-semibold transition-colors duration-300
                    ${isCurrent ? 'text-white' : 'text-gray-300'}
                    ${isPending ? '!text-gray-500' : ''}
                  `}>
                    {stage.title}
                  </h3>
                  <p className={`text-xs transition-colors duration-300
                    ${isCompleted ? 'text-gray-400' : ''}
                    ${isCurrent ? 'text-indigo-400 font-medium' : ''}
                    ${isPending ? 'text-gray-500' : ''}
                  `}>
                    {isCurrent ? 'Working...' : isCompleted ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};