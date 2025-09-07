import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { StageDisplay } from './components/StageDisplay';
import { PlanCard } from './components/PlanCard';
import { FinalPlanDisplay } from './components/FinalPlanDisplay';
import { InnovationHub } from './components/InnovationHub';
import type { Plan } from './types';
import { STAGES } from './constants';
import { generatePlanForStage } from './services/geminiService';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setUserInput('');
    setIsGenerating(false);
    setCurrentStageIndex(-1);
    setPlans([]);
    setError(null);
  };

  const handlePlanEvent = useCallback(async (idea: string) => {
    if (!idea.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentStageIndex(0);
    setPlans([]);
    setError(null);
    setUserInput(idea);

    let accumulatedContext = '';

    try {
      for (let i = 0; i < STAGES.length; i++) {
        setCurrentStageIndex(i);
        const stage = STAGES[i];
        const generatedContent = await generatePlanForStage(idea, stage, accumulatedContext);
        
        const newPlan: Plan = {
          title: stage.title,
          content: generatedContent,
          icon: stage.icon,
        };

        setPlans(prevPlans => [...prevPlans, newPlan]);
        accumulatedContext += `\n\n**${stage.title}**:\n${generatedContent}`;
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the plan. Please try again.');
    } finally {
      setIsGenerating(false);
      setCurrentStageIndex(STAGES.length); // Mark all as complete
    }
  }, [isGenerating]);

  const isComplete = !isGenerating && plans.length > 0 && plans.length === STAGES.length;

  const fullPlanContext = useMemo(() => {
    if (!isComplete) return '';
    return plans.map(p => `## ${p.title}\n\n${p.content}`).join('\n\n---\n\n');
  }, [plans, isComplete]);

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500 selection:text-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-5xl py-16 sm:py-24">
          <Header />
          <main>
            {!isComplete && (
              <PromptInput onPlan={handlePlanEvent} isGenerating={isGenerating} />
            )}
            
            {(isGenerating || plans.length > 0) && (
              <div className="mt-12">
                {isGenerating && <h2 className="text-xl font-bold text-center text-indigo-300 mb-6">AI Agent is on the job!</h2>}
                <StageDisplay currentStageIndex={currentStageIndex} />
              </div>
            )}

            {error && <div className="mt-8 text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}

            <div className="mt-10">
              {isComplete ? (
                <>
                  <FinalPlanDisplay plan={plans[plans.length - 1]} onReset={resetState} />
                  <InnovationHub planContext={fullPlanContext} />
                </>
              ) : (
                <div className="space-y-8">
                  {plans.map((plan, index) => (
                    <PlanCard key={index} plan={plan} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;