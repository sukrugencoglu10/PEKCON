'use client';

import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

export default function StepIndicator({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
                transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-[#0069b4] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
            >
              {currentStep > step.id ? <Check size={16} /> : step.id}
            </div>
            <span
              className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                currentStep >= step.id ? 'text-[#0069b4]' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-300 ${
                currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
