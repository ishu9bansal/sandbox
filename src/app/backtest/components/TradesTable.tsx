"use client";

import { ProcessedTrade, formatCurrency, formatDateTime } from '../utils';

interface TradesTableProps {
    trades: ProcessedTrade[];
    selectedDate?: string;
}

export default function TradesTable({ trades, selectedDate }: TradesTableProps) {
    const filteredTrades = selectedDate 
        ? trades.filter(t => t.date === selectedDate)
        : trades;

    if (filteredTrades.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {selectedDate ? `No trades on ${selectedDate}` : 'No trades available'}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contract
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            P&L
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Cumulative P&L
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTrades.map((trade, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatDateTime(trade.entryTime)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {trade.contract}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded ${
                                    trade.transaction === 'BUY' 
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                }`}>
                                    {trade.transaction}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                                {trade.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                                {formatCurrency(trade.price)}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                                trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {formatCurrency(trade.pnl)}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                                trade.cumulativePnl >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {formatCurrency(trade.cumulativePnl)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
