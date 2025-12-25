import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  serials: [],
  loading: false,
  error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const createSerial = createAsyncThunk(
  "serial/createSerial",
  async (data) => {
    const response = await axios.post(`${BASE_URL}/serial`, data);
    return response.data;
  }
);

export const getSerials = createAsyncThunk("serial/getSerials", async () => {
  const response = await axios.get(`${BASE_URL}/serial`);
  return response.data;
});

export const deleteSerial = createAsyncThunk(
  "serial/deleteSerial",
  async (id) => {
    await axios.delete(`${BASE_URL}/serial/${id}`);
    return id;
  }
);

const serialSlice = createSlice({
  name: "serial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSerial.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSerial.fulfilled, (state, action) => {
        state.loading = false;
        state.serials.push(action.payload.data);
      })
      .addCase(createSerial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getSerials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSerials.fulfilled, (state, action) => {
        state.loading = false;
        state.serials = action.payload.data;
      })
      .addCase(getSerials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSerial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSerial.fulfilled, (state, action) => {
        state.loading = false;
        state.serials = state.serials.filter(
          (serial) => serial._id !== action.payload
        );
      })
      .addCase(deleteSerial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default serialSlice.reducer;

