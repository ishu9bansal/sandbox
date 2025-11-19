// =======================
// MODULE: StepContent.tsx
// =======================
import React from 'react';
import { Step } from './types';
import FieldRenderer from './FieldRenderer';

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

export default StepContent;
