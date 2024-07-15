import dbConnect from "@/DBConnect/dbConnect";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import PlannerModel, { Planner, WeekPlan } from '@/models/PlannerModel';

interface UpdatePayload {
  year: number;
  month: number;
  income?: number;
  savings?: number;
  weekPlans?: WeekPlan[];
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
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
    const plannerData = await PlannerModel.findOne({ userId });
    
    if (!plannerData) {
      return NextResponse.json({ error: 'No planner data found for this user' }, { status: 404 });
    }

    return NextResponse.json(plannerData);
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch planner data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { year, month, income, savings, weekPlans }: UpdatePayload = body;
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

    let planner: any = await PlannerModel.findOne({ userId });
      
    if (!planner) {
      planner = new PlannerModel({ userId, years: {} });
    }

    if (!planner?.years[year]) {
      planner.years[year] = {};
    }

    if (!planner.years[year][month]) {
      planner.years[year][month] = {
        income: 0,
        savings: 0,
        weekPlans: [],
      };
    }

    if (income !== undefined) {
      planner.years[year][month].income = income;
    }

    if (savings !== undefined) {
      planner.years[year][month].savings = savings;
    }

    if (weekPlans) {
      planner.years[year][month].weekPlans = weekPlans;
    }

    await planner.save();
    return NextResponse.json(planner);  
      
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Failed to update planner data' }, { status: 500 });
  }
}