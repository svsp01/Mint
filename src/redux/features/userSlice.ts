import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  isLoggedIn: boolean;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  monthlyIncome: number;
  profileImageUrl: string;
  bio: string;
  skills: string;
  interests: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  monthlyIncome: 0,
  profileImageUrl: '',
  bio: '',
  skills: '',
  interests: '',
};
interface UserData {
  token: string;
  user: {
    username: string;
    email: string;
  };
}

export const logingin:any = createAsyncThunk(
  'user/login',
  async (userData: { email: string; password: string }) => {
    const response = await axios.post('/api/login', userData);
    const userdata ={
      email:response?.data?.data?.email,
      userId: response?.data?.data?.userId
    }
    localStorage.setItem('token', response?.data?.data?.token);
    localStorage.setItem('user', JSON.stringify(userdata));

    return response.data;
  }
);

export const signingup:any = createAsyncThunk(
  'user/signup',
  async (userData: Omit<UserState, 'isLoggedIn' | 'emailNotifications' | 'theme'>) => {
    const response = await axios.post('/api/login', userData);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(logingin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.username = action.payload.username;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.phoneNumber = action.payload.phoneNumber;
        state.monthlyIncome = action.payload.monthlyIncome;
        state.profileImageUrl = action.payload.profileImageUrl;
        state.bio = action.payload.bio;
      })
      .addCase(signingup.fulfilled, (state, action) => {
        return { ...state, ...action.payload, isLoggedIn: true };
      });
  },
});

export const { logout, updateProfile, updateSettings } = userSlice.actions;
export default userSlice.reducer;
