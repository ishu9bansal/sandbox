// =======================
// MODULE: FieldRenderer.tsx
// =======================
import React from 'react';
import { Field } from './types';

interface FieldRendererProps {
    field: Field;
    value: any;
    onChange: (value: any) => void;
}

// TODO: add number field type
// TODO: make it extensible for more field types in future
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

export default FieldRenderer;
