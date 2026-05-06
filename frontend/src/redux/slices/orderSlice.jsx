import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createOrder = createAsyncThunk('order/create', async (order, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const res = await axios.post('/api/orders', order, {
      headers: { Authorization: `Bearer ${auth.user.token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyOrders = createAsyncThunk('order/myOrders', async (_, { getState }) => {
  const { auth } = getState();
  const res = await axios.get('/api/orders/myorders', {
    headers: { Authorization: `Bearer ${auth.user.token}` }
  });
  return res.data;
});

const orderSlice = createSlice({
  name: 'order',
  initialState: { order: null, orders: [], loading: false, error: null, success: false },
  reducers: { resetOrder: (s) => { s.success = false; s.order = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (s) => { s.loading = true; })
      .addCase(createOrder.fulfilled, (s, a) => { s.loading = false; s.success = true; s.order = a.payload; })
      .addCase(createOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.orders = a.payload; });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;