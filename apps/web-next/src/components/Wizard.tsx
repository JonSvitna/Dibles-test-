'use client';

import React from 'react';
import Button from './Button';

interface WizardStep {
  title: string;
  description?: string;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onNext?: () => void;
  onPrev?: () => void;
  onComplete?: () => void;
  children: React.ReactNode;
  nextLabel?: string;
  prevLabel?: string;
  completeLabel?: string;
  canGoNext?: boolean;
}

export default function Wizard({
  steps,
  currentStep,
  onNext,
  onPrev,
  onComplete,
  children,
  nextLabel = 'Next',
  prevLabel = 'Back',
  completeLabel = 'Complete',
  canGoNext = true,
}: WizardProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 min-h-[400px]">
        {children}
      </div>
      
      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <div>
          {!isFirstStep && (
            <Button variant="outline" onClick={onPrev}>
              {prevLabel}
            </Button>
          )}
        </div>
        <div>
          {!isLastStep && (
            <Button onClick={onNext} disabled={!canGoNext}>
              {nextLabel}
            </Button>
          )}
          {isLastStep && (
            <Button onClick={onComplete}>
              {completeLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
