"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  query,
  onSnapshot,
  QuerySnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Tabs, Tab } from "@nextui-org/tabs";

import { db } from "./firebase";
import { Transaction, TransactionFormData } from "@/types";
import {
  saveTransactionsToLocalStorage,
  loadTransactionsFromLocalStorage,
  getCurrentDate,
} from "@/lib/utils";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { TransactionSummaryComponent } from "@/components/transaction-summary";
import { DataManagement } from "@/components/data-management";
import { PieChart } from "@/components/pie-chart";
import { getCategoryData } from "@/lib/utils";

// Legacy interface for backward compatibility
interface ExpenseItem {
  id: string;
  name: string;
  price: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Add transaction to database and local storage
  const addTransaction = async (formData: TransactionFormData) => {
    setLoading(true);
    setError("");

    try {
      const transaction: Omit<Transaction, "id"> = {
        type: formData.type,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        createdAt: new Date(),
      };

      // Add to Firebase
      const docRef = await addDoc(collection(db, "transactions"), transaction);

      // The transaction will be automatically added to state via the onSnapshot listener
      console.log("Transaction added with ID:", docRef.id);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error adding transaction:", err);
      }
      setError("Failed to add transaction. Please try again.");
      throw err; // Re-throw to handle in form component
    } finally {
      setLoading(false);
    }
  };

  // Load transactions from Firebase and local storage
  useEffect(() => {
    console.log("Initializing transaction data...");

    // Load from local storage first for immediate display
    const localTransactions = loadTransactionsFromLocalStorage();
    if (localTransactions.length > 0) {
      setTransactions(localTransactions);
    }

    // Set up Firebase listener for real-time updates
    const q = query(collection(db, "transactions"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        console.log(
          "Firebase connection successful! Documents:",
          querySnapshot.size
        );
        const transactionsArr: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // Handle both new transaction format and legacy expense format
          if (data.type && data.description) {
            // New transaction format
            transactionsArr.push({
              id: doc.id,
              type: data.type,
              description: data.description,
              amount:
                typeof data.amount === "string"
                  ? parseFloat(data.amount)
                  : data.amount || 0,
              category: data.category || "Other",
              date: data.date || getCurrentDate(),
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          } else if (data.name && data.price) {
            // Legacy expense format - convert to new format
            transactionsArr.push({
              id: doc.id,
              type: "expense",
              description: data.name,
              amount:
                typeof data.price === "string"
                  ? parseFloat(data.price)
                  : data.price || 0,
              category: "Other",
              date: getCurrentDate(),
              createdAt: new Date(),
            });
          }
        });

        setTransactions(transactionsArr);

        // Save to local storage for offline access
        saveTransactionsToLocalStorage(transactionsArr);

        setError(""); // Clear any previous errors on successful load
      },
      (err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching transactions:", err);
        }
        setError("Failed to load transactions. Using local data if available.");
      }
    );

    return () => unsubscribe();
  }, []);

  // Delete transaction from database
  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
      console.log("Transaction deleted:", id);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting transaction:", err);
      }
      setError("Failed to delete transaction. Please try again.");
      throw err;
    }
  };

  // Edit transaction in database
  const editTransaction = async (transaction: Transaction) => {
    try {
      const { id, ...updateData } = transaction;
      await updateDoc(doc(db, "transactions", id), updateData);
      console.log("Transaction updated:", id);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating transaction:", err);
      }
      setError("Failed to update transaction. Please try again.");
      throw err;
    }
  };

  // Import transactions
  const importTransactions = async (importedTransactions: Transaction[]) => {
    setLoading(true);
    try {
      // Add each transaction to Firebase
      for (const transaction of importedTransactions) {
        const { id, ...transactionData } = transaction; // Remove id to let Firebase generate new ones
        await addDoc(collection(db, "transactions"), transactionData);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error importing transactions:", err);
      }
      setError("Failed to import some transactions. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get category data for charts
  const expenseCategories = getCategoryData(transactions, "expense");
  const incomeCategories = getCategoryData(transactions, "income");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">💰 Expense Tracker</h1>
        <p className="text-default-500">
          Manage your finances with ease - track income, expenses, and see your
          financial health at a glance
        </p>
      </div>

      {error && (
        <div
          className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            aria-label="Close error message"
            className="float-right font-bold text-danger-700 hover:text-danger-900"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="w-full justify-center"
        size="lg"
      >
        <Tab key="dashboard" title="📊 Dashboard">
          <div className="space-y-6">
            <TransactionSummaryComponent transactions={transactions} />

            {transactions.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {expenseCategories.length > 0 && (
                  <PieChart
                    data={expenseCategories}
                    title="Expense Distribution"
                    type="expense"
                  />
                )}
                {incomeCategories.length > 0 && (
                  <PieChart
                    data={incomeCategories}
                    title="Income Sources"
                    type="income"
                  />
                )}
              </div>
            )}
          </div>
        </Tab>

        <Tab key="add-transaction" title="➕ Add Transaction">
          <div className="max-w-2xl mx-auto">
            <TransactionForm onSubmit={addTransaction} loading={loading} />
          </div>
        </Tab>

        <Tab key="transactions" title="📝 Transactions">
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
            loading={loading}
          />
        </Tab>

        <Tab key="data-management" title="💾 Data">
          <div className="max-w-2xl mx-auto">
            <DataManagement
              transactions={transactions}
              onImport={importTransactions}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
