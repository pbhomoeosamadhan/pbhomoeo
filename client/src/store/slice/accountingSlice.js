import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchTransactions = createAsyncThunk(
  "accounting/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/accounting`);
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message);
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "accounting/createTransaction",
  async (newTransaction, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/accounting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message);
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "accounting/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/accounting/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message);
      }
      return id; // Return the id of the deleted transaction
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  transactions: [],
  isLoading: false,
  isError: null,
};

const accountingSlice = createSlice({
  name: "accounting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export default accountingSlice.reducer;
