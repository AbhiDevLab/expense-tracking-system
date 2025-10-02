import { Transaction, TransactionSummary, CategoryData } from '@/types';

// Local Storage utilities
export const LOCAL_STORAGE_KEY = 'expense-tracker-transactions';

export const saveTransactionsToLocalStorage = (transactions: Transaction[]): void => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Failed to save transactions to localStorage:', error);
    }
};

export const loadTransactionsFromLocalStorage = (): Transaction[] => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load transactions from localStorage:', error);
        return [];
    }
};

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
            `"${t.description}"`,
            `"${t.category}"`,
            t.amount.toString()
        ].join(','))
    ].join('\n');

    return csvContent;
};

export const parseCSVTransactions = (csvContent: string): Transaction[] => {
    const lines = csvContent.split('\n');
    const transactions: Transaction[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [date, type, description, category, amount] = line.split(',');

        if (date && type && description && category && amount) {
            transactions.push({
                id: `imported-${Date.now()}-${i}`,
                date: date.trim(),
                type: type.trim() as 'income' | 'expense',
                description: description.replace(/"/g, '').trim(),
                category: category.replace(/"/g, '').trim(),
                amount: parseFloat(amount.trim())
            });
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
