import mongoose, { Schema, Document } from 'mongoose';
export interface WeekPlan {
    id: number;
    startDate: Date;
    endDate: Date;
    budget: number;
    expenses: { emoji: string; value: number }[];
  }
  
export interface Planner extends Document {
  years: {
    [year: number]: {
      [month: number]: {
        income: number;
        savings: number;
        weekPlans: WeekPlan[];
      };
    };
  };
}

const WeekPlanSchema = new Schema({
  id: Number,
  startDate: Date,
  endDate: Date,
  budget: Number,
  expenses: {
    type: Map,
    of: [{ emoji: String, value: Number }],
  },
});

const PlannerSchema = new Schema({
  
  years: {
    type: Map,
    of: {
      type: Map,
      of: {
        income: Number,
        savings: Number,
        weekPlans: [WeekPlanSchema],
      },
    },
  },
});

export default mongoose.models.Planner || mongoose.model<Planner>('Planner', PlannerSchema);
