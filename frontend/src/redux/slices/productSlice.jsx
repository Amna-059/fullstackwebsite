import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`/api/products?${query}`);
  return res.data;
});

export const fetchProduct = createAsyncThunk('product/fetchOne', async (id) => {
  const res = await axios.get(`/api/products/${id}`);
  return res.data;
});

export const fetchFeatured = createAsyncThunk('product/featured', async () => {
  const res = await axios.get('/api/products/featured');
  return res.data;
});

export const fetchTrending = createAsyncThunk('product/trending', async () => {
  const res = await axios.get('/api/products/trending');
  return res.data;
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [], product: null, featured: [], trending: [],
    total: 0, pages: 1, loading: false, error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false; s.products = a.payload.products;
        s.total = a.payload.total; s.pages = a.payload.pages;
      })
      .addCase(fetchProduct.fulfilled, (s, a) => { s.product = a.payload; })
      .addCase(fetchFeatured.fulfilled, (s, a) => { s.featured = a.payload; })
      .addCase(fetchTrending.fulfilled, (s, a) => { s.trending = a.payload; });
  }
});

export default productSlice.reducer;