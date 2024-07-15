import { configureStore } from '@reduxjs/toolkit';
import plannerReducer from './features/plannerSlice';
import expensesReducer from './features/expensesSlice';
import quotesReducer from './features/quotesSlice';
import emojiMapReducer from './features/emojiMapSlice';
import emojiCategoryReducer from './features/EmojiCategorySlice';
import userSlice from './features/userSlice';




export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    planner: plannerReducer,
    quotes: quotesReducer,
    emojiMap: emojiMapReducer,
    emojiCategory: emojiCategoryReducer,
    user:userSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch