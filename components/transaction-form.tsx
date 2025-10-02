"use client";

import React, { useState } from "react";
import { Input, Select, SelectItem, Card, CardBody, CardHeader, Tabs, Tab, Button } from "@nextui-org/react";
import {
  TransactionFormData,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/types";
import { validateTransactionForm, getCurrentDate } from "@/lib/utils";

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    description: "",
    amount: "",
    category: "",
    date: getCurrentDate(),
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTransactionForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        type: formData.type, // Keep the same type selected
        description: "",
        amount: "",
        category: "",
        date: getCurrentDate(),
      });
    } catch (error) {
      setErrors(["Failed to add transaction. Please try again."]);
    }
  };

  const handleTypeChange = (key: string | number) => {
    const newType = key as "income" | "expense";
    setFormData({
      ...formData,
      type: newType,
      category: "", // Reset category when type changes
    });
  };

  const categories =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-semibold">Add Transaction</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Tabs */}
          <Tabs
            selectedKey={formData.type}
            onSelectionChange={handleTypeChange}
            className="w-full"
            color={formData.type === "income" ? "success" : "danger"}
          >
            <Tab key="expense" title="💸 Expense" />
            <Tab key="income" title="💰 Income" />
          </Tabs>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Description"
              placeholder={`Enter ${formData.type} description`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              isRequired
              variant="bordered"
              className="col-span-1 md:col-span-2"
            />

            <Input
              label="Amount (₹)"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              isRequired
              variant="bordered"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₹</span>
                </div>
              }
            />

            <Select
              label="Category"
              placeholder="Select category"
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const selectedCategory = Array.from(keys)[0] as string;
                setFormData({ ...formData, category: selectedCategory });
              }}
              isRequired
              variant="bordered"
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              isRequired
              variant="bordered"
              className="md:col-span-2"
            />
          </div>

          <Button
            type="submit"
            color={formData.type === "income" ? "success" : "danger"}
            size="lg"
            className="w-full font-medium"
            isLoading={loading}
            disabled={loading}
          >
            {loading
              ? `Adding ${formData.type}...`
              : `Add ${formData.type === "income" ? "💰 Income" : "💸 Expense"}`}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
