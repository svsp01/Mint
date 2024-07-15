import mongoose, { Schema, Document } from 'mongoose';

export interface Expense extends Document {
  userId: string;
  category: string;
  itemName: string;
  emoji: string;
  amount: number;
  date: Date;
}

const ExpenseSchema: Schema = new Schema({
  userId: { type: String },
  category: { type: String },
  itemName: { type: String },
  emoji: { type: String },
  amount: { type: Number },
  date: { type: Date },
});

export default mongoose.models.Expense || mongoose.model<Expense>('Expense', ExpenseSchema);
