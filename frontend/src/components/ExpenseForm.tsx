"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

export default function ExpenseForm({ userId }: { userId: string }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive amount");
      setSuccess("");
      return;
    }
    if (!category || !date) {
      setError("Please fill in all required fields");
      setSuccess("");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          date,
          description,
          user_id: userId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save expense");
      setSuccess("Expense saved!");
      setError("");
      setAmount("");
      setCategory(categories[0]);
      setDate("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Log Expense</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>
        <button
          type="button"
          className="flex-1 rounded-md bg-gray-300 py-2 text-gray-700 hover:bg-gray-400"
          onClick={() => {
            setAmount("");
            setCategory(categories[0]);
            setDate("");
            setDescription("");
            setError("");
            setSuccess("");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
