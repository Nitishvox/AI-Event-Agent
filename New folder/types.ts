// Fix: Import React to make the JSX namespace available.
import type React from 'react';

export interface Plan {
  title: string;
  content: string;
  // Fix for line 5: Use React.JSX.Element to resolve "Cannot find namespace 'JSX'" error.
  icon: React.JSX.Element;
}

export interface Stage {
  title: string;
  description: string;
  // Fix for line 11: Use React.JSX.Element to resolve "Cannot find namespace 'JSX'" error.
  icon: React.JSX.Element;
  prompt: (eventIdea: string, context: string) => string;
}

export interface Recommendation {
  title: string;
  description: string;
  icon: 'Tech' | 'Experience' | 'Engagement';
}