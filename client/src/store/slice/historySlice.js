import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Fetch all history
export const fetchHistory = createAsyncThunk("history/fetch", async () => {
  const res = await fetch(`${BASE_URL}/history`);
  return res.json();
});

// Create new history
export const createHistory = createAsyncThunk(
  "history/create",
  async (data) => {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
);

// Update subHistory
export const updateHistory = createAsyncThunk(
  "history/update",
  async ({ id, subHistory }) => {
    const res = await fetch(`${BASE_URL}/history/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subHistory }),
    });
    return res.json();
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: { list: [], isLoading: false, isError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createHistory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateHistory.fulfilled, (state, action) => {
        const index = state.list.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default historySlice.reducer;
