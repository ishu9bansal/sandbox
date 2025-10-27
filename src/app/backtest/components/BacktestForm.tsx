"use client";

import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { BacktestFormData, SYMBOLS, FREQS, OPTION_TYPES, TRANSACTION_TYPES } from '../types';

interface BacktestFormProps {
    onSubmit: (data: BacktestFormData) => void;
    isLoading: boolean;
}

export default function BacktestForm({ onSubmit, isLoading }: BacktestFormProps) {
    const [formData, setFormData] = useState<Partial<BacktestFormData>>({
        start_date: '2022-06-01',
        end_date: '2022-06-30',
        capital: 100000,
        lot_size: 50,
        position: {
            per_day_positions_threshold: 5,
            entry: {
                time: '09:17'
            },
            exit: {
                time: '15:00',
                movement: 100
            },
            focus: {
                symbol: 'NIFTY',
                step: 50,
                expiry: {
                    weekday: 3,
                    frequency: 'WEEKLY'
                }
            },
            legs: [
                {
                    strike: { offset: 0 },
                    type: 'CE',
                    transaction: 'SELL'
                },
                {
                    strike: { offset: 0 },
                    type: 'PE',
                    transaction: 'SELL'
                }
            ]
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as BacktestFormData);
    };

    const updateField = (path: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current: any = newData;
            
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                // Guard against prototype pollution
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                    return prev;
                }
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
            
            const finalKey = keys[keys.length - 1];
            // Guard against prototype pollution
            if (finalKey === '__proto__' || finalKey === 'constructor' || finalKey === 'prototype') {
                return prev;
            }
            
            current[finalKey] = value;
            return newData;
        });
    };

    const addLeg = () => {
        setFormData(prev => ({
            ...prev,
            position: {
                ...prev.position!,
                legs: [
                    ...(prev.position?.legs || []),
                    {
                        strike: { offset: 0 },
                        type: 'CE' as const,
                        transaction: 'BUY' as const
                    }
                ]
            }
        }));
    };

    const removeLeg = (index: number) => {
        setFormData(prev => ({
            ...prev,
            position: {
                ...prev.position!,
                legs: prev.position!.legs.filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Start Date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    required
                />
                <Input
                    label="End Date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => updateField('end_date', e.target.value)}
                    required
                />
                <Input
                    label="Capital"
                    type="number"
                    value={formData.capital}
                    onChange={(e) => updateField('capital', Number(e.target.value))}
                    required
                />
                <Input
                    label="Lot Size"
                    type="number"
                    value={formData.lot_size}
                    onChange={(e) => updateField('lot_size', Number(e.target.value))}
                    required
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-4">Position Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Entry Time (HH:MM)"
                        type="time"
                        value={formData.position?.entry?.time}
                        onChange={(e) => updateField('position.entry.time', e.target.value)}
                        required
                    />
                    <Input
                        label="Exit Time (HH:MM)"
                        type="time"
                        value={formData.position?.exit?.time}
                        onChange={(e) => updateField('position.exit.time', e.target.value)}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Symbol
                        </label>
                        <select
                            value={formData.position?.focus?.symbol}
                            onChange={(e) => updateField('position.focus.symbol', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        >
                            {SYMBOLS.map(symbol => (
                                <option key={symbol} value={symbol}>{symbol}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Strike Step"
                        type="number"
                        value={formData.position?.focus?.step}
                        onChange={(e) => updateField('position.focus.step', Number(e.target.value))}
                        required
                    />
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Strategy Legs</h3>
                    <Button type="button" onClick={addLeg} size="sm" variant="outline">
                        Add Leg
                    </Button>
                </div>
                <div className="space-y-4">
                    {formData.position?.legs?.map((leg, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Leg {index + 1}</h4>
                                {formData.position!.legs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLeg(index)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={leg.type}
                                        onChange={(e) => updateField(`position.legs.${index}.type`, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {OPTION_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Transaction
                                    </label>
                                    <select
                                        value={leg.transaction}
                                        onChange={(e) => updateField(`position.legs.${index}.transaction`, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {TRANSACTION_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Strike Offset"
                                    type="number"
                                    value={leg.strike.offset}
                                    onChange={(e) => updateField(`position.legs.${index}.strike.offset`, Number(e.target.value))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Running Backtest...' : 'Run Backtest'}
            </Button>
        </form>
    );
}
