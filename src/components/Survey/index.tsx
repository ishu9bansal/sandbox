
import { useState } from 'react';
import { Step } from './types';
import StepContent from './StepContent';
import CompletionScreen from './CompletionScreen';

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