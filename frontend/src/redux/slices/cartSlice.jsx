import { createSlice } from '@reduxjs/toolkit';

const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartItems,
    shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {}
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(
        i => i._id === item._id && i.size === item.size && i.color === item.color
      );
      if (existing) existing.quantity += item.quantity;
      else state.items.push(item);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        i => !(i._id === action.payload._id && i.size === action.payload.size && i.color === action.payload.color)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { _id, size, color, quantity } = action.payload;
      const item = state.items.find(i => i._id === _id && i.size === size && i.color === color);
      if (item) item.quantity = quantity;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;