import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isStarred: { type: Boolean, default: false },
});

export default mongoose.model("Expense", expenseSchema);



