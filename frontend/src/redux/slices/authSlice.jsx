import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const user = JSON.parse(localStorage.getItem('user'));

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/login', data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/register', data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const res = await axios.put('/api/auth/profile', data, {
      headers: { Authorization: `Bearer ${auth.user.token}` }
    });
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: user || null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, action) => { state.loading = false; state.user = action.payload; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(login.pending, pending).addCase(login.fulfilled, fulfilled).addCase(login.rejected, rejected)
      .addCase(register.pending, pending).addCase(register.fulfilled, fulfilled).addCase(register.rejected, rejected)
      .addCase(updateProfile.pending, pending).addCase(updateProfile.fulfilled, fulfilled).addCase(updateProfile.rejected, rejected);
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;