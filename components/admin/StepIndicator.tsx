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
    <nav aria-label="Gönderim adımları" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                      : isCurrent
                      ? 'bg-[#0069b4] text-white shadow-md shadow-[#0069b4]/30 ring-4 ring-[#0069b4]/15'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check size={18} strokeWidth={2.5} /> : step.id}
                </div>
                <span
                  className={`text-xs sm:text-sm mt-2 whitespace-nowrap tracking-tight ${
                    isCurrent
                      ? 'font-semibold text-slate-900'
                      : isCompleted
                      ? 'font-medium text-emerald-700'
                      : 'font-medium text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-3 sm:mx-4 mb-6 rounded-full transition-colors duration-300 ${
                    isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
