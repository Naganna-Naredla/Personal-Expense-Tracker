import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "../pages/ExpenseForm";

function Dashboard({ token }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { "x-auth-token": token },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      alert("Failed to load expenses. Please try again.");
    }
  };

  const handleAddExpense = (newExpense) => {
    setExpenses([newExpense, ...expenses].slice(0, 10));
  };

  return (
    <div className="dashboard-container">
      <h1>Expense Dashboard</h1>
      <ExpenseForm onAdd={handleAddExpense} token={token} />
      <div className="expense-grid">
        {expenses.map((expense) => (
          <div key={expense._id} className="expense-card">
            <h3>{expense.description}</h3>
            <p>💰 ₹{expense.amount.toFixed(2)}</p>
            <p>📅 {new Date(expense.date).toLocaleDateString()}</p>
            <p>⏰ {expense.time || "N/A"}</p>
            <p>📋 {expense.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;