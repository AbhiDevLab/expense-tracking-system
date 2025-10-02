"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Progress } from "@nextui-org/progress";
import { Chip } from "@nextui-org/chip";
import { Transaction, TransactionSummary, CategoryData } from "@/types";
import { calculateTransactionSummary, getCategoryData } from "@/lib/utils";

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export const TransactionSummaryComponent: React.FC<TransactionSummaryProps> = ({
  transactions,
}) => {
  const summary = calculateTransactionSummary(transactions);
  const expenseCategories = getCategoryData(transactions, "expense");
  const incomeCategories = getCategoryData(transactions, "income");

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const getNetIncomeColor = (netIncome: number) => {
    if (netIncome > 0) return "text-success";
    if (netIncome < 0) return "text-danger";
    return "text-default-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Financial Summary Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Income */}
        <Card className="bg-success-50 border-success-200">
          <CardBody className="text-center p-4">
            <div className="text-success-600 text-sm font-medium mb-1">
              Total Income
            </div>
            <div className="text-2xl font-bold text-success-700">
              {formatCurrency(summary.totalIncome)}
            </div>
            <div className="text-xs text-success-500 mt-1">
              {incomeCategories.reduce((sum, cat) => sum + cat.count, 0)}{" "}
              transactions
            </div>
          </CardBody>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-danger-50 border-danger-200">
          <CardBody className="text-center p-4">
            <div className="text-danger-600 text-sm font-medium mb-1">
              Total Expenses
            </div>
            <div className="text-2xl font-bold text-danger-700">
              {formatCurrency(summary.totalExpenses)}
            </div>
            <div className="text-xs text-danger-500 mt-1">
              {expenseCategories.reduce((sum, cat) => sum + cat.count, 0)}{" "}
              transactions
            </div>
          </CardBody>
        </Card>

        {/* Net Income */}
        <Card
          className={`${summary.netIncome >= 0 ? "bg-success-50 border-success-200" : "bg-danger-50 border-danger-200"}`}
        >
          <CardBody className="text-center p-4">
            <div
              className={`text-sm font-medium mb-1 ${summary.netIncome >= 0 ? "text-success-600" : "text-danger-600"}`}
            >
              Net Income
            </div>
            <div
              className={`text-2xl font-bold ${getNetIncomeColor(summary.netIncome)}`}
            >
              {summary.netIncome >= 0 ? "+" : ""}
              {formatCurrency(summary.netIncome)}
            </div>
            <div
              className={`text-xs mt-1 ${summary.netIncome >= 0 ? "text-success-500" : "text-danger-500"}`}
            >
              {summary.netIncome >= 0 ? "Surplus" : "Deficit"}
            </div>
          </CardBody>
        </Card>

        {/* Total Transactions */}
        <Card className="bg-primary-50 border-primary-200">
          <CardBody className="text-center p-4">
            <div className="text-primary-600 text-sm font-medium mb-1">
              Total Transactions
            </div>
            <div className="text-2xl font-bold text-primary-700">
              {summary.transactionCount}
            </div>
            <div className="text-xs text-primary-500 mt-1">All time</div>
          </CardBody>
        </Card>
      </div>

      {/* Expense Categories Breakdown */}
      {expenseCategories.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Expense Categories</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {expenseCategories.slice(0, 5).map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="danger">
                        {category.name}
                      </Chip>
                      <span className="text-sm text-default-500">
                        {category.count} transactions
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-default-500">
                        {category.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={category.percentage}
                    color="danger"
                    size="sm"
                    className="w-full"
                  />
                </div>
              ))}
              {expenseCategories.length > 5 && (
                <div className="text-center text-sm text-default-500 pt-2">
                  +{expenseCategories.length - 5} more categories
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Income Categories Breakdown */}
      {incomeCategories.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Income Sources</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {incomeCategories.slice(0, 5).map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="success">
                        {category.name}
                      </Chip>
                      <span className="text-sm text-default-500">
                        {category.count}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-default-500">
                        {category.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={category.percentage}
                    color="success"
                    size="sm"
                    className="w-full"
                  />
                </div>
              ))}
              {incomeCategories.length > 5 && (
                <div className="text-center text-sm text-default-500 pt-2">
                  +{incomeCategories.length - 5} more sources
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <Card className="lg:col-span-3">
          <CardBody className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
            <p className="text-default-500">
              Add some transactions to see your financial summary and insights.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
