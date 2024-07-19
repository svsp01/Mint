import mongoose from 'mongoose';

const WeekPlanSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    budget: Number,
    expenses: [
      {
        categoryId: mongoose.Schema.Types.ObjectId,
        amount: Number,
        date: Date,
      }
    ]
  });
  
const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    income: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    weekPlans: [WeekPlanSchema],
  });
  
  export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
  