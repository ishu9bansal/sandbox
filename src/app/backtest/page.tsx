"use client";

import { useState } from 'react';
import Card from '@/components/compositions/card';
import Button from '@/components/Button';
import BacktestForm from './components/BacktestForm';
import PnLChart from './components/PnLChart';
import TradesTable from './components/TradesTable';
import { makeBacktestRequest } from './api';
import { BacktestFormData, BacktestResult } from './types';
import { processOrders, aggregateDailyPnL, ProcessedTrade, DailyPnL, formatCurrency } from './utils';
import { SAMPLE_BACKTEST_DATA } from './mock-data';

export default function BacktestPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<BacktestResult | null>(null);
    const [trades, setTrades] = useState<ProcessedTrade[]>([]);
    const [dailyPnL, setDailyPnL] = useState<DailyPnL[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | undefined>();

    const loadSampleData = () => {
        setError(null);
        const sampleResult: BacktestResult = {
            data: SAMPLE_BACKTEST_DATA,
            initial_capital: 100000
        };
        
        setResult(sampleResult);
        const processedTrades = processOrders(sampleResult.data);
        const aggregatedPnL = aggregateDailyPnL(processedTrades);
        
        setTrades(processedTrades);
        setDailyPnL(aggregatedPnL);
    };

    const handleSubmit = async (formData: BacktestFormData) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setTrades([]);
        setDailyPnL([]);
        setSelectedDate(undefined);

        try {
            const backtestResult = await makeBacktestRequest(formData);
            
            if (!backtestResult) {
                setError('Failed to fetch backtest results. Please try again.');
                return;
            }

            if (backtestResult.error) {
                setError(backtestResult.error);
                return;
            }

            setResult(backtestResult);
            
            if (backtestResult.data && backtestResult.data.length > 0) {
                const processedTrades = processOrders(backtestResult.data);
                const aggregatedPnL = aggregateDailyPnL(processedTrades);
                
                setTrades(processedTrades);
                setDailyPnL(aggregatedPnL);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = result ? {
        totalTrades: trades.length,
        finalPnL: trades.length > 0 ? trades[trades.length - 1].cumulativePnl : 0,
        initialCapital: result.initial_capital,
        finalCapital: result.initial_capital + (trades.length > 0 ? trades[trades.length - 1].cumulativePnl : 0),
        returnPercent: result.initial_capital > 0 
            ? ((trades.length > 0 ? trades[trades.length - 1].cumulativePnl : 0) / result.initial_capital * 100) 
            : 0
    } : null;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Backtest Results Visualizer</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Configure your options trading strategy and visualize the backtest results with interactive P&L charts.
                    </p>
                </div>
                <Button onClick={loadSampleData} variant="outline" size="sm">
                    Load Sample Data
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="">
                    <Card title="Strategy Configuration" collapsible>
                        <BacktestForm onSubmit={handleSubmit} isLoading={isLoading} />
                    </Card>
                </div>

                <div className="space-y-6">
                    {error && (
                        <Card>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        </Card>
                    )}

                    {stats && (
                        <Card title="Performance Summary">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
                                    <p className="text-2xl font-bold">{stats.totalTrades}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Initial Capital</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stats.initialCapital)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Final Capital</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stats.finalCapital)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total P&L</p>
                                    <p className={`text-2xl font-bold ${stats.finalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(stats.finalPnL)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Return %</p>
                                    <p className={`text-2xl font-bold ${stats.returnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.returnPercent.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {dailyPnL.length > 0 && (
                        <Card title="P&L Over Time">
                            <PnLChart data={dailyPnL} />
                        </Card>
                    )}

                    {trades.length > 0 && (
                        <Card title="Trade Details">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Filter by Date
                                </label>
                                <select
                                    value={selectedDate || ''}
                                    onChange={(e) => setSelectedDate(e.target.value || undefined)}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">All Dates</option>
                                    {dailyPnL.map(day => (
                                        <option key={day.date} value={day.date}>
                                            {day.date} ({day.trades} trades)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <TradesTable trades={trades} selectedDate={selectedDate} />
                        </Card>
                    )}

                    {!isLoading && !result && (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Configure your strategy and click "Run Backtest" to see results
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
