import React, { useState } from "react";
import axios from "axios";

function ExpenseForm({ onAdd, token }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      alert("Description and amount are required");
      return;
    }
    if (amount <= 0) {
      alert("Amount must be positive");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/expenses",
        { description, amount: Number(amount), category, date, time },
        { headers: { "x-auth-token": token } }
      );
      onAdd(res.data);
      setDescription("");
      setAmount("");
      setCategory("Other");
      setDate("");
      setTime("");
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Bills">Bills</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;