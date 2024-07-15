// Example API route for managing expenses
import dbConnect from '@/DBConnect/dbConnect';
import ExpenseModel, { Expense } from '@/models/ExpenseModel';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

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

    const expenses = await ExpenseModel.find({ userId });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const { category, itemName, emoji, amount, date } = await request.json();

    const newExpense: Expense = new ExpenseModel({
      userId,
      category,
      emoji,
      itemName,
      amount,
      date: new Date(date),
    });

    const savedExpense = await newExpense.save();

    return NextResponse.json(savedExpense);
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
