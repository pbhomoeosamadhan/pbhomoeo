import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/doctors`);
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

export const createDoctor = createAsyncThunk(
  "doctors/createDoctor",
  async (newDoctor, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
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

const initialState = {
  doctors: [],
  isLoading: false,
  isError: null,
};

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(createDoctor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors.push(action.payload.doctor);
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export default doctorSlice.reducer;
