// =======================
// MODULE: CompletionScreen.tsx
// =======================
import React from 'react';
import { Step } from './types';

interface CompletionScreenProps {
    submittedData: Record<string, any>;
    steps: Step[];
    titleClassName: string;
    buttonClassName: string;
    onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
    submittedData,
    steps,
    titleClassName,
    buttonClassName,
    onRestart,
}) => {
    const formatValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'None selected';
        }
        return value || 'Not provided';
    };
    const getFieldLabel = (fieldId: string) => {
        for (const step of steps) {
            if (step.fields) {
                const field = step.fields.find(f => f.id === fieldId);
                if (field) return field.label;
            }
        }
        return fieldId;
    };
    return (
        <>
            <h2 className={titleClassName}>
                <span className="flex items-center justify-center gap-3">
                    <svg 
                        className="h-8 w-8 text-green-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <span className="text-green-600 dark:text-green-400">
                        Survey Completed!
                    </span>
                </span>
            </h2>
            <div className="mb-6">
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for completing the survey. Your responses have been recorded.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Your Submitted Responses:
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(submittedData).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-b-0">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {getFieldLabel(key)}:
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded text-sm">
                                    {formatValue(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex-1"></div>
                <button 
                    onClick={onRestart}
                    className={`${buttonClassName} bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700`}
                >
                    Start New Survey
                </button>
            </div>
        </>
    );
};

export default CompletionScreen;
