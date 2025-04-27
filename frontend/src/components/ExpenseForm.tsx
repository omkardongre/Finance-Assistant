"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }
    // TODO: Submit expense data
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Log Expense</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
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
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
