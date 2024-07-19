import { AnyARecord } from "dns";
import { Revenue } from "./definitions";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const getMotivationalMessage = (savings: number): string => {
  if (savings > 10000) {
    return "Wow, you're really building your savings! Keep it up!";
  } else if (savings > 5000) {
    return "Impressive savings! You're on the right track.";
  } else if (savings > 2000) {
    return "You're making good progress in saving. Keep going!";
  } else if (savings > 0) {
    return "Every bit saved counts! Aim to save a bit more next month.";
  } else if (savings === 0) {
    return "You didn't save this month. Let's try to save something next time.";
  } else {
    return "Don't worry, saving takes time. Let's focus on it next month.";
  }
};

export function getMonthDays(year: number, month: number): Date[] {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
}
export function getFormatedDate(date: any): string {
  let firstDay = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  console.log(month, "firstDay")

  if (firstDay < 9) {
    firstDay = `0${firstDay}`;
  }
  if (month < 9) {
    month = `0${month}`;
  }

  return `${year}-${month}-${firstDay}`;
}


export function getUserData() {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  if (!username || !userId || !token) {
    throw new Error('User data not found in local storage');
  }

  return { username, userId, token };
}
