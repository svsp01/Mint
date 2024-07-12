// src/app/redux/features/emojiCategorySlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface EmojiCategoryState {
  [category: string]: { emoji: string, name: string }[];
}

const initialState: EmojiCategoryState = {
  Food: [
    { emoji: '🍏', name: 'Groceries' },
    { emoji: '🍔', name: 'Hotel Food' },
    { emoji: '🍿', name: 'Snacks' },
    { emoji: '🍕', name: 'Pizza' },
    { emoji: '🍜', name: 'Noodles' },
    { emoji: '☕', name: 'Coffee' },
    { emoji: '🍱', name: 'Bento' },
    { emoji: '🥗', name: 'Salad' },
    { emoji: '🍳', name: 'Breakfast' },
  ],
  Transport: [
    { emoji: '🚌', name: 'Bus' },
    { emoji: '⛽', name: 'Petrol' },
    { emoji: '🚕', name: 'Taxi' },
    { emoji: '🚉', name: 'Train' },
    { emoji: '🚲', name: 'Bicycle' },
    { emoji: '🛵', name: 'Scooter' },
    { emoji: '✈️', name: 'Plane' },
  ],
  Entertainment: [
    { emoji: '🎬', name: 'Movies' },
    { emoji: '🎮', name: 'Games' },
    { emoji: '🎵', name: 'Music' },
    { emoji: '🎨', name: 'Art' },
    { emoji: '🍻', name: 'Bar' },
    { emoji: '🎭', name: 'Theatre' },
    { emoji: '📚', name: 'Books' },
  ],
  Others: [
    { emoji: '🛍️', name: 'Shopping' },
    { emoji: '💼', name: 'Business' },
    { emoji: '💊', name: 'Healthcare' },
    { emoji: '🏋️', name: 'Gym' },
    { emoji: '🎁', name: 'Gifts' },
    { emoji: '📱', name: 'Phone Bill' },
    { emoji: '🏠', name: 'Rent' },
    { emoji: '🧾', name: 'Utilities' },
  ],
};

const emojiCategorySlice = createSlice({
  name: 'emojiCategory',
  initialState,
  reducers: {},
});

export default emojiCategorySlice.reducer;
