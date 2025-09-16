const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

// Add expense
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, category, date, time } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ msg: "Description and amount are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be positive" });
    }

    const expenseDate = date ? new Date(date) : new Date();
    if (isNaN(expenseDate)) {
      return res.status(400).json({ msg: "Invalid date format" });
    }

    const expense = new Expense({
      userId: req.user,
      description,
      amount,
      category: category || "Other",
      date: expenseDate,
      time: time || expenseDate.toTimeString().slice(0, 5),
    });

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get latest 10 expenses for Dashboard
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user })
      .sort({ date: -1, time: -1 })
      .limit(10);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all expenses for Reports
router.get("/all", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user })
      .sort({ date: -1, time: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching all expenses:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Inside routes/expenses.js

/// Monthly summary
router.get("/summary/monthly/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    const year = req.query.year || new Date().getFullYear(); // 2025
    const startDate = new Date(year, 0, 1); // Jan 1
    const endDate = new Date(year, 11, 31); // Dec 31

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          total: "$total",
        },
      },
    ]);

    console.log("Monthly summary data:", summary); // Debug log

    res.json(summary || []); // Ensure it's always an array
  } catch (err) {
    console.error("Aggregation error:", err); // Detailed error log
    res.status(500).json({ msg: "Server error - check logs" });
  }
});

module.exports = router;