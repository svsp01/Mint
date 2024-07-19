// models/ExpenseModel.ts

import mongoose from 'mongoose';

const ExpensesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  weekPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeekPlan', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

const ExpenseModel = mongoose.models.Expenses || mongoose.model('Expense', ExpensesSchema);

export default ExpenseModel;