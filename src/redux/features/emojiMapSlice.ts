import { createSlice } from '@reduxjs/toolkit';

const emojiMapSlice:any = createSlice({
  name: 'emojiMap',
  initialState: {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    default: '💰'
  },
  reducers: {}
});

export default emojiMapSlice.reducer;
