// components/ExpenseSummary.tsx
interface ExpenseSummaryProps {
    expenses: any[];
  }
  
  export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
    const summary = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  
    return (
      <div className="text-sm">
        {Object.entries(summary).map(([category, amount]: any) => (
          <div key={category} className="flex justify-between">
            <span>{category}:</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }