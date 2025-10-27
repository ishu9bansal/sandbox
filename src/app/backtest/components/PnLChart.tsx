"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyPnL } from '../utils';
import { formatCurrency, formatDate } from '../utils';

interface PnLChartProps {
    data: DailyPnL[];
}

export default function PnLChart({ data }: PnLChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                No data available
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold mb-2">{formatDate(data.date)}</p>
                    <p className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Daily P&L: </span>
                        <span className={data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(data.pnl)}
                        </span>
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Cumulative P&L: </span>
                        <span className={data.cumulativePnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(data.cumulativePnl)}
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Trades: {data.trades}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#3b82f6" 
                    name="Daily P&L"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
                <Line 
                    type="monotone" 
                    dataKey="cumulativePnl" 
                    stroke="#10b981" 
                    name="Cumulative P&L"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
