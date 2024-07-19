// models/PlannerModel.ts

import mongoose from 'mongoose';

const PlannerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  years: {
    type: Map,
    of: {
      type: Map,
      of: {
        income: { type: Number, default: 0 },
        savings: { type: Number, default: 0 },
        weekPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WeekPlan' }]
      }
    }
  }
});

const PlannerModel = mongoose.models.Planner || mongoose.model('Planner', PlannerSchema);

export default PlannerModel;