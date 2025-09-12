import express from "express";
import Expense from "../Models/Expense.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Utility: Get Start/End Date from Month String
 * Supports: "10" (only month) OR "2025-10" (YYYY-MM)
 */
const getMonthRange = (month) => {
  if (!month) return null;

  let year, mon;
  if (month.includes("-")) {
    [year, mon] = month.split("-");
  } else {
    const now = new Date();
    year = now.getFullYear();
    mon = month;
  }

  if (!year || !mon || isNaN(year) || isNaN(mon)) return null;

  const startDate = new Date(Number(year), Number(mon) - 1, 1);
  const endDate = new Date(Number(year), Number(mon), 1);

  return { startDate, endDate };
};

// ✅ Get All Expenses (supports month filter)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { month } = req.query;
    const matchQuery = { user: req.user.id }; // ✅ Only ObjectId

    const range = getMonthRange(month);
    if (range) matchQuery.date = { $gte: range.startDate, $lt: range.endDate };

    const expenses = await Expense.find(matchQuery).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("EXPENSE FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount, description, date, title } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount required" });
    }

    const expense = new Expense({
      title: title || category,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date(),
      user: req.user._id, // ✅ FIXED
    });

    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("EXPENSE ADD ERROR:", err);
    res.status(400).json({ message: err.message });
  }
});



// ✅ Delete Expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // ✅ Only ObjectId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("EXPENSE DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Toggle Star
router.patch("/:id/toggle-star", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id, // ✅ Only ObjectId
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.isStarred = !expense.isStarred;
    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error("TOGGLE STAR ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get Starred Expenses
router.get("/starred", authMiddleware, async (req, res) => {
  try {
    const starredExpenses = await Expense.find({
      user: req.user.id, // ✅ Only ObjectId
      isStarred: true,
    }).sort({ date: -1 });

    res.json(starredExpenses);
  } catch (error) {
    console.error("STARRED FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get Summary (Month Filter Support)
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const { month } = req.query;
    const matchQuery = { user: req.user._id }; // ✅ Ensure user is ObjectId

    const range = getMonthRange(month);
    if (range) matchQuery.date = { $gte: range.startDate, $lt: range.endDate };

    console.log("📊 SUMMARY MATCH QUERY:", matchQuery); // ✅ Debug Log

    const summary = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    console.log("📊 SUMMARY RESULT:", summary); // ✅ Debug Log

    res.json(summary);
  } catch (error) {
    console.error("SUMMARY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});



export default router;





