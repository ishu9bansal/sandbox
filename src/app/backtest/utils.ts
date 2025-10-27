import { RawOrder } from "./types";

export interface ProcessedTrade {
    date: string;
    entryTime: string;
    contract: string;
    strike: number;
    type: string;
    transaction: string;
    quantity: number;
    price: number;
    pnl: number;
    cumulativePnl: number;
}

export interface DailyPnL {
    date: string;
    pnl: number;
    cumulativePnl: number;
    trades: number;
}

/**
 * Process raw orders into matched trades with P&L
 */
export function processOrders(orders: RawOrder[]): ProcessedTrade[] {
    const trades: ProcessedTrade[] = [];
    const positions = new Map<string, RawOrder[]>();
    
    // Group orders by contract
    orders.forEach(order => {
        const key = `${order.contract.symbol}_${order.contract.strike}_${order.contract.type}_${order.contract.expiry}`;
        if (!positions.has(key)) {
            positions.set(key, []);
        }
        positions.get(key)!.push(order);
    });
    
    let cumulativePnl = 0;
    
    // Process each contract's positions
    positions.forEach((contractOrders) => {
        contractOrders.sort((a, b) => 
            new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
        );
        
        for (const order of contractOrders) {
            const multiplier = order.transaction_type === "SELL" ? 1 : -1;
            const pnl = order.entry_price * order.quantity * multiplier;
            cumulativePnl += pnl;
            
            const entryDate = new Date(order.entry_time);
            
            trades.push({
                date: entryDate.toISOString().split('T')[0],
                entryTime: order.entry_time,
                contract: `${order.contract.symbol} ${order.contract.strike} ${order.contract.type}`,
                strike: order.contract.strike,
                type: order.contract.type,
                transaction: order.transaction_type,
                quantity: order.quantity,
                price: order.entry_price,
                pnl,
                cumulativePnl
            });
        }
    });
    
    // Sort by entry time
    trades.sort((a, b) => 
        new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
    );
    
    // Recalculate cumulative P&L in chronological order
    cumulativePnl = 0;
    trades.forEach(trade => {
        cumulativePnl += trade.pnl;
        trade.cumulativePnl = cumulativePnl;
    });
    
    return trades;
}

/**
 * Aggregate trades by day for daily P&L chart
 */
export function aggregateDailyPnL(trades: ProcessedTrade[]): DailyPnL[] {
    const dailyMap = new Map<string, DailyPnL>();
    
    let cumulativePnl = 0;
    
    trades.forEach(trade => {
        if (!dailyMap.has(trade.date)) {
            dailyMap.set(trade.date, {
                date: trade.date,
                pnl: 0,
                cumulativePnl: 0,
                trades: 0
            });
        }
        
        const daily = dailyMap.get(trade.date)!;
        daily.pnl += trade.pnl;
        daily.trades += 1;
        cumulativePnl += trade.pnl;
        daily.cumulativePnl = cumulativePnl;
    });
    
    return Array.from(dailyMap.values()).sort((a, b) => 
        a.date.localeCompare(b.date)
    );
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format datetime for display
 */
export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
