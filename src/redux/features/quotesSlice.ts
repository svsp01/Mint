import { createSlice } from '@reduxjs/toolkit';

const quotesSlice = createSlice({
  name: 'quotes',
  initialState: [
    "Save money and money will save you.",
    "A penny saved is a penny earned.",
    "The art is not in making money, but in keeping it.",
    "Don't save what is left after spending; spend what is left after saving.",
    "Financial freedom is available to those who learn about it and work for it."
  ],
  reducers: {}
});

export default quotesSlice.reducer;
