"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Select,
  SelectItem,
  Input,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import {
  formatDate,
  filterTransactionsByCategory,
  filterTransactionsByType,
} from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (transaction: Transaction) => Promise<void>;
  loading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onEdit,
  loading = false,
}) => {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filter transactions based on current filters
  const filteredTransactions = transactions
    .filter((t) => filterTransactionsByType([t], filterType).length > 0)
    .filter((t) => filterTransactionsByCategory([t], filterCategory).length > 0)
    .filter(
      (t) =>
        searchTerm === "" ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await onDelete(id);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    onOpen();
  };

  const handleEditSubmit = async () => {
    if (editingTransaction && onEdit) {
      await onEdit(editingTransaction);
      onClose();
      setEditingTransaction(null);
    }
  };

  // Get unique categories from transactions for filter
  const allCategories = Array.from(
    new Set(transactions.map((t) => t.category))
  ).sort();

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col w-full space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <Chip color="primary" variant="flat">
              {filteredTransactions.length} transactions
            </Chip>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="bordered"
              startContent={<span className="text-default-400">🔍</span>}
            />

            <Tabs
              selectedKey={filterType}
              onSelectionChange={(key) =>
                setFilterType(key as "all" | "income" | "expense")
              }
              size="sm"
            >
              <Tab key="all" title="All" />
              <Tab key="income" title="Income" />
              <Tab key="expense" title="Expenses" />
            </Tabs>

            <Select
              placeholder="Filter by category"
              selectedKeys={filterCategory === "all" ? [] : [filterCategory]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFilterCategory(selected || "all");
              }}
              variant="bordered"
              size="sm"
            >
              {[
                <SelectItem key="all" value="all">
                  All Categories
                </SelectItem>,
                ...allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                )),
              ]}
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-default-500">
            {transactions.length === 0
              ? "No transactions yet. Add your first transaction above!"
              : "No transactions match your current filters."}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Chip
                      color={
                        transaction.type === "income" ? "success" : "danger"
                      }
                      variant="flat"
                      size="sm"
                    >
                      {transaction.type === "income" ? "💰" : "💸"}{" "}
                      {transaction.type}
                    </Chip>
                    <Chip variant="bordered" size="sm">
                      {transaction.category}
                    </Chip>
                    <span className="text-sm text-default-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  <p className="font-medium text-lg">
                    {transaction.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl font-bold font-mono ${
                      transaction.type === "income"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </span>

                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEdit(transaction)}
                        isIconOnly
                      >
                        ✏️
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(transaction.id)}
                      isLoading={loading}
                      isIconOnly
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>

      {/* Edit Modal */}
      {editingTransaction && (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader>Edit Transaction</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Description"
                  value={editingTransaction.description}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      description: e.target.value,
                    })
                  }
                  variant="bordered"
                />

                <Input
                  label="Amount (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingTransaction.amount.toString()}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  variant="bordered"
                />

                <Select
                  label="Category"
                  selectedKeys={[editingTransaction.category]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setEditingTransaction({
                      ...editingTransaction,
                      category: selected,
                    });
                  }}
                  variant="bordered"
                >
                  {(editingTransaction.type === "income"
                    ? INCOME_CATEGORIES
                    : EXPENSE_CATEGORIES
                  ).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Date"
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      date: e.target.value,
                    })
                  }
                  variant="bordered"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleEditSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );
};
