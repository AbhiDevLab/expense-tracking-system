"use client";

import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { CategoryData } from "@/types";

interface PieChartProps {
  data: CategoryData[];
  title: string;
  type: "income" | "expense";
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, type }) => {
  const colors =
    type === "income"
      ? ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22"]
      : ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a"];

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Calculate angles for pie slices
  const slices = data.map((item, index) => {
    const percentage = total > 0 ? (item.amount / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    return {
      ...item,
      percentage,
      angle,
      color: colors[index % colors.length],
    };
  });

  // Create SVG path for pie slice
  const createPath = (
    startAngle: number,
    endAngle: number,
    radius: number = 80
  ) => {
    const centerX = 100;
    const centerY = 100;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = 0;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardBody className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-default-500">No data to display</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Pie Chart SVG */}
          <div className="flex-shrink-0">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="drop-shadow-sm"
            >
              {slices.map((slice, index) => {
                const path = createPath(
                  currentAngle,
                  currentAngle + slice.angle
                );
                currentAngle += slice.angle;

                return (
                    <path
                      key={slice.name}
                      d={path}
                      fill={slice.color}
                      stroke="white"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <title>{`${slice.name}: ₹${slice.amount.toFixed(2)} (${slice.percentage.toFixed(1)}%)`}</title>
                    </path>
                  );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {slices.map((slice, index) => (
              <div
                key={slice.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-medium">{slice.name}</span>
                  <Chip size="sm" variant="flat">
                    {slice.count} transactions
                  </Chip>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{slice.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-default-500">
                    {slice.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
