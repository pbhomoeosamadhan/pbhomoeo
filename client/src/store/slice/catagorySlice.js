import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// GET
export const fetchCatagory = createAsyncThunk("catagory/fetch", async () => {
  const res = await fetch(`${BASE_URL}/catagory`);
  return res.json();
});

// POST (new category)
export const createCatagory = createAsyncThunk(
  "catagory/create",
  async (data) => {
    const res = await fetch(`${BASE_URL}/catagory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
);

// PUT (add/update subCategory)
export const updateCatagory = createAsyncThunk(
  "catagory/update",
  async ({ id, subCatagory }) => {
    const res = await fetch(`${BASE_URL}/catagory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subCatagory }),
    });
    return res.json();
  }
);

const catagorySlice = createSlice({
  name: "catagory",
  initialState: {
    list: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCatagory.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // create
      .addCase(createCatagory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // update
      .addCase(updateCatagory.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default catagorySlice.reducer;
