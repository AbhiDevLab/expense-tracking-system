"use client";

import React, { useRef } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Transaction } from "@/types";
import {
  exportTransactionsToJSON,
  exportTransactionsToCSV,
  parseCSVTransactions,
} from "@/lib/utils";

interface DataManagementProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => Promise<void>;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  transactions,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: "json" | "csv") => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "json") {
      content = exportTransactionsToJSON(transactions);
      filename = `expense-tracker-${new Date().toISOString().split("T")[0]}.json`;
      mimeType = "application/json";
    } else {
      content = exportTransactionsToCSV(transactions);
      filename = `expense-tracker-${new Date().toISOString().split("T")[0]}.csv`;
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      let importedTransactions: Transaction[] = [];

      if (file.name.endsWith(".json")) {
        importedTransactions = JSON.parse(content);
      } else if (file.name.endsWith(".csv")) {
        importedTransactions = parseCSVTransactions(content);
      } else {
        alert("Please select a JSON or CSV file.");
        return;
      }

      if (importedTransactions.length > 0) {
        await onImport(importedTransactions);
        alert(
          `Successfully imported ${importedTransactions.length} transactions!`
        );
      } else {
        alert("No valid transactions found in the file.");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import transactions. Please check the file format.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Data Management</h3>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Export Dropdown */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                color="primary"
                disabled={transactions.length === 0}
                className="flex-1"
              >
                📤 Export Data
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Export options"
              onAction={(key) => handleExport(key as "json" | "csv")}
            >
              <DropdownItem key="json" description="Export as JSON file">
                📄 Export as JSON
              </DropdownItem>
              <DropdownItem key="csv" description="Export as CSV file">
                📊 Export as CSV
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Import Button */}
          <Button
            variant="bordered"
            color="secondary"
            onPress={handleImport}
            className="flex-1"
          >
            📥 Import Data
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="mt-4 text-sm text-default-500">
          <p className="mb-2">
            <strong>Export:</strong> Download your transactions as JSON or CSV
            files for backup or analysis.
          </p>
          <p>
            <strong>Import:</strong> Upload previously exported JSON or CSV
            files to restore your data.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
