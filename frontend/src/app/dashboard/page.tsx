"use client";
import { useState, useEffect } from "react";
import DashboardCard from "../../components/DashboardCard";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (!token) {
        setError("Not authenticated. Please log in.");
        return;
      }
      // Decode JWT to get user_id (sub)
      let user_id = "";
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        user_id = payload.sub;
      } catch {
        setError("Invalid token. Please log in again.");
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses?user_id=${user_id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch expenses");
        setExpenses(data.expenses);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Expenses" value={`$${expenses.reduce((sum, e) => sum + e.amount, 0)}`} />
        <DashboardCard title="Budget Status" value="Under Budget" />
        <DashboardCard title="Recent Transactions" value={expenses.length.toString()} />
      </div>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Recent Expenses</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="p-2">{expense.date}</td>
                <td className="p-2">{expense.category}</td>
                <td className="p-2">${expense.amount}</td>
                <td className="p-2">{expense.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
