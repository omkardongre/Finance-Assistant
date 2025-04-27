import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="rounded-lg shadow-md bg-white p-4 flex flex-col items-center justify-center min-w-[140px] min-h-[100px]">
      <div className="text-lg font-semibold text-gray-700">{title}</div>
      <div className="text-2xl font-bold text-blue-600 mt-2">{value}</div>
    </div>
  );
}
