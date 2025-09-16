const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, default: "Other" },
  date: { type: Date, required: true, default: Date.now },
  time: { type: String }, // Optional, e.g., "14:30"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", ExpenseSchema);