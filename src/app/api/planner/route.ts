// pages/api/planner.ts

import dbConnect from "@/DBConnect/dbConnect";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import PlannerModel from '@/models/PlannerModel';
import WeekPlanModel from '@/models/WeekPlanModel';
import CategoryModel from '@/models/CategoryModel';
import ExpenseModel from '@/models/ExpenseModel';
import UserModal from "@/models/UserModal";
import BudgetModel from "@/models/BudgetModel";

interface UpdatePayload {
  year: number;
  month: number;
  income?: number;
  savings?: number;
  weekPlans?: {
    startDate: Date;
    endDate: Date;
    budget: number;
    expenses?: {
      categoryId: string;
      amount: number;
      date: Date;
    }[];
  }[];
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') || '');
    const month = parseInt(url.searchParams.get('month') || '');

    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as { userId: string };
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;

    // Query the BudgetModel
    const budgetData = await BudgetModel.findOne({ userId, year, month })
      .populate({
        path: 'weekPlans',
        model: WeekPlanModel,
        populate: {
          path: 'expenses',
          model: ExpenseModel
        }
      });

    if (!budgetData) {
      return NextResponse.json({ error: 'No budget data found for this year and month' }, { status: 404 });
    }

    return NextResponse.json(budgetData);

  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch budget data' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Error connecting to database:', error);
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { year, month, income, savings, weekPlans } = body;

  const authHeader = request.headers.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Missing token');
    return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as { userId: string };
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  const { userId } = decoded;

  let budget;
  try {
    budget = await BudgetModel.findOne({ userId, year, month });
    if (!budget) {
      budget = new BudgetModel({ userId, year, month, weekPlans: [] });
    }
  } catch (error) {
    console.error('Error finding or creating budget:', error);
    return NextResponse.json({ error: 'Failed to find or create budget' }, { status: 500 });
  }

  try {
    if (income !== undefined) {
      budget.income = income;
    }

    if (savings !== undefined) {
      budget.savings = savings;
    }

    if (weekPlans) {
      for (const weekPlan of weekPlans) {
        const newWeekPlan = new weekPlan({
          startDate: weekPlan.startDate,
          endDate: weekPlan.endDate,
          budget: weekPlan.budget,
        });

        if (weekPlan.expenses) {
          for (const expense of weekPlan.expenses) {
            const newExpense = new expense({
              categoryId: expense.categoryId,
              amount: expense.amount,
              date: expense.date,
            });
            newWeekPlan.expenses.push(newExpense);
          }
        }

        budget.weekPlans.push(newWeekPlan);
      }
    }
  } catch (error) {
    console.error('Error processing week plans or expenses:', error);
    return NextResponse.json({ error: 'Failed to process week plans or expenses' }, { status: 500 });
  }

  try {
    await budget.save();
    await UserModal.updateOne({ _id: userId }, { $addToSet: { budgets: budget._id } });
    console.log(`Saved budget data for user: ${userId}`);
  } catch (error) {
    console.error('Error saving budget data:', error);
    return NextResponse.json({ error: 'Failed to save budget data' }, { status: 500 });
  }

  return NextResponse.json(budget);
}
