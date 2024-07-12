import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  username: string;
  email: string;
  password:string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  monthlyIncome: number;
  profileImageUrl: string;
  bio: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
  email: '',
  password:'',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  monthlyIncome: 0,
  profileImageUrl: '',
  bio: '',
  emailNotifications: true,
  theme: 'light',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    signup: (state, action: PayloadAction<Omit<UserState, 'isLoggedIn' | 'emailNotifications' | 'theme'>>) => {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
    logout: (state) => {
      return { ...initialState };
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    updateSettings: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { login, signup, logout, updateProfile, updateSettings } = userSlice.actions;
export default userSlice.reducer;