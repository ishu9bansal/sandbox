import React, { useState, ReactNode } from 'react';

export interface Field {
    id: string;
    label: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'datetime';
    options?: string[];
    required?: boolean;
    placeholder?: string;
}

export interface Step {
    id: string;
    title: string;
    fields?: Field[];
    customContent?: ReactNode;
}

export interface SurveyProps {
    steps: Step[];
    onSubmit: (data: Record<string, any>) => void;
    prefilledData?: Record<string, any>;
    nextLabel?: string;
    previousLabel?: string;
    submitLabel?: string;
    buttonClassName?: string;
    cardClassName?: string;
    titleClassName?: string;
}

// Field Renderer Sub-component
interface FieldRendererProps {
    field: Field;
    value: any;
    onChange: (value: any) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
    switch (field.type) {
        case 'text':
            return (
                <input
                    type="text"
                    id={field.id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                />
            );

        case 'textarea':
            return (
                <textarea
                    id={field.id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                    rows={4}
                />
            );

        case 'select':
            return (
                <select
                    id={field.id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );

        case 'radio':
            return (
                <div className="space-y-2">
                    {field.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-2 dark:text-gray-300">
                            <input
                                type="radio"
                                name={field.id}
                                value={option}
                                checked={value === option}
                                onChange={(e) => onChange(e.target.value)}
                                required={field.required}
                                className="focus:ring-blue-500"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );

        case 'checkbox':
            return (
                <div className="space-y-2">
                    {field.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-2 dark:text-gray-300">
                            <input
                                type="checkbox"
                                value={option}
                                checked={(value || []).includes(option)}
                                onChange={(e) => {
                                    const currentValues = value || [];
                                    const newValues = e.target.checked
                                        ? [...currentValues, option]
                                        : currentValues.filter((v: string) => v !== option);
                                    onChange(newValues);
                                }}
                                className="focus:ring-blue-500"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );

        case 'datetime':
            // Auto-initialize with current datetime if value is empty
            React.useEffect(() => {
                if (!value) {
                    const now = new Date();
                    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16);
                    onChange(localDateTime);
                }
            }, []);

            const handleReset = () => {
                const now = new Date();
                const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
                onChange(localDateTime);
            };

            return (
                <div className="flex gap-2">
                    <input
                        type="datetime-local"
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={field.required}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600"
                    />
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        title="Reset to current date and time"
                    >
                        Reset to Now
                    </button>
                </div>
            );

        default:
            return null;
    }
};

// Step Content Sub-component
interface StepContentProps {
    step: Step;
    formData: Record<string, any>;
    onInputChange: (fieldId: string, value: any) => void;
}

const StepContent: React.FC<StepContentProps> = ({ step, formData, onInputChange }) => {
    if (step.customContent) {
        return <>{step.customContent}</>;
    }

    return (
        <div className="space-y-4">
            {step.fields?.map((field) => (
                <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium mb-1 dark:text-gray-200">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <FieldRenderer
                        field={field}
                        value={formData[field.id] || ''}
                        onChange={(value) => onInputChange(field.id, value)}
                    />
                </div>
            ))}
        </div>
    );
};

// Completion Screen Sub-component
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

export const Survey: React.FC<SurveyProps> = ({
    steps,
    onSubmit,
    prefilledData = {},
    nextLabel = 'Next',
    previousLabel = 'Previous',
    submitLabel = 'Submit',
    buttonClassName = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    cardClassName = 'max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:shadow-gray-900',
    titleClassName = 'text-2xl font-bold mb-4 dark:text-white',
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>(prefilledData);
    const [isCompleted, setIsCompleted] = useState(false);
    const [submittedData, setSubmittedData] = useState<Record<string, any>>({});

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        setSubmittedData({ ...formData });
        setIsCompleted(true);
        onSubmit(formData);
    };

    const handleRestart = () => {
        setCurrentStep(0);
        setFormData(prefilledData);
        setIsCompleted(false);
        setSubmittedData({});
    };

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <div className={cardClassName}>
            {isCompleted ? (
                <CompletionScreen
                    submittedData={submittedData}
                    steps={steps}
                    titleClassName={titleClassName}
                    buttonClassName={buttonClassName}
                    onRestart={handleRestart}
                />
            ) : (
                <>
                    <h2 className={titleClassName}>{currentStepData.title}</h2>

                    <div className="mb-6">
                        <StepContent
                            step={currentStepData}
                            formData={formData}
                            onInputChange={handleInputChange}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePrevious}
                            disabled={isFirstStep}
                            className={`${buttonClassName} ${
                                isFirstStep ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {previousLabel}
                        </button>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Step {currentStep + 1} of {steps.length}
                        </span>

                        {isLastStep ? (
                            <button onClick={handleSubmit} className={buttonClassName}>
                                {submitLabel}
                            </button>
                        ) : (
                            <button onClick={handleNext} className={buttonClassName}>
                                {nextLabel}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};