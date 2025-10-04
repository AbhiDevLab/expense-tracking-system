import { Transaction, TransactionSummary, CategoryData } from '@/types';

// Transaction calculation utilities
export const calculateTransactionSummary = (transactions: Transaction[]): TransactionSummary => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactions.length
    };
};

// Category analysis utilities
export const getCategoryData = (transactions: Transaction[], type: 'income' | 'expense'): CategoryData[] => {
    const filteredTransactions = transactions.filter(t => t.type === type);
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    filteredTransactions.forEach(transaction => {
        const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
        categoryMap.set(transaction.category, {
            amount: existing.amount + transaction.amount,
            count: existing.count + 1
        });
    });

    return Array.from(categoryMap.entries())
        .map(([name, data]) => ({
            name,
            amount: data.amount,
            count: data.count,
            percentage: total > 0 ? (data.amount / total) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);
};

// Date utilities
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

// Validation utilities
export const validateTransactionForm = (data: {
    description: string;
    amount: string;
    category: string;
    date: string;
}): string[] => {
    const errors: string[] = [];

    if (!data.description.trim()) {
        errors.push('Description is required');
    }

    if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
        errors.push('Amount must be a valid number greater than 0');
    }

    if (!data.category) {
        errors.push('Category is required');
    }

    if (!data.date) {
        errors.push('Date is required');
    }

    return errors;
};

// Export/Import utilities
export const exportTransactionsToJSON = (transactions: Transaction[]): string => {
    return JSON.stringify(transactions, null, 2);
};

export const exportTransactionsToCSV = (transactions: Transaction[]): string => {
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
    const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
            t.date,
            t.type,
            `"${t.description.replace(/"/g, '""')}"`,
            `"${t.category.replace(/"/g, '""')}"`,
            t.amount.toString()
        ].join(','))
    ].join('\n');

    return csvContent;
};

// Helper function to parse CSV lines with quotes
const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
};

export const parseCSVTransactions = (csvContent: string, userId: string): Transaction[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const transactions: Transaction[] = [];

    const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
            const parsedLine = parseCSVLine(line);
            const [date, type, description, category, amount] = parsedLine;

            if (date && type && description && category && amount) {
                const cleanType = type.trim().toLowerCase() as 'income' | 'expense';
                if (cleanType !== 'income' && cleanType !== 'expense') {
                    console.warn(`Invalid transaction type at line ${i + 1}: ${type}`);
                    continue;
                }

                const transactionAmount = parseFloat(amount.trim());
                if (isNaN(transactionAmount) || transactionAmount <= 0) {
                    console.warn(`Invalid amount at line ${i + 1}: ${amount}`);
                    continue;
                }

                transactions.push({
                    id: `imported-${Date.now()}-${i}`,
                    date: date.trim(),
                    type: cleanType,
                    description: description.replace(/[&]/g, '').trim(),
                    category: category.replace(/[&]/g, '').trim(),
                    amount: transactionAmount,
                    userId: userId
                });
            }
        } catch (error) {
            console.warn(`Failed to parse line ${i + 1}: ${line}`, error);
            continue;
        }
    }

    return transactions;
};

// Filter utilities
export const filterTransactionsByCategory = (transactions: Transaction[], category: string): Transaction[] => {
    return category === 'all' ? transactions : transactions.filter(t => t.category === category);
};

export const filterTransactionsByType = (transactions: Transaction[], type: 'all' | 'income' | 'expense'): Transaction[] => {
    return type === 'all' ? transactions : transactions.filter(t => t.type === type);
};

export const filterTransactionsByDateRange = (
    transactions: Transaction[],
    startDate: string,
    endDate: string
): Transaction[] => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
};

// Search utilities
export const searchTransactions = (transactions: Transaction[], query: string): Transaction[] => {
    if (!query.trim()) return transactions;
    
    const lowerQuery = query.toLowerCase();
    return transactions.filter(t => 
        t.description.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery) ||
        t.amount.toString().includes(lowerQuery)
    );
};

// Sort utilities
export const sortTransactions = (transactions: Transaction[], sortBy: keyof Transaction, sortOrder: 'asc' | 'desc'): Transaction[] => {
    return [...transactions].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortOrder === 'asc' ? -1 : 1;
        if (!bValue) return sortOrder === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aString = String(aValue);
        const bString = String(bValue);
        return sortOrder === 'asc' 
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
    });
};

// Generate unique ID
export const generateId = (): string => {
    return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};