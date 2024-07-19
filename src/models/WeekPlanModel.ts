// models/WeekPlanModel.ts

import mongoose from 'mongoose';

const WeekPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true }
});

const WeekPlanModel = mongoose.models.WeekPlan || mongoose.model('WeekPlan', WeekPlanSchema);

export default WeekPlanModel;