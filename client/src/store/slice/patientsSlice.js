import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Existing thunks
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async () => {
    const res = await fetch(`${BASE_URL}/patients`);
    return res.json();
  }
);

export const fetchNextId = createAsyncThunk(
  "patients/fetchNextId",
  async () => {
    const res = await fetch(`${BASE_URL}/patients/id`);
    return res.json();
  }
);

export const createPatient = createAsyncThunk(
  "patients/createPatient",
  async (newPatient) => {
    const res = await fetch(`${BASE_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPatient),
    });
    return res.json();
  }
);

// ✅ New thunk to update patient
export const updatePatient = createAsyncThunk(
  "patients/updatePatient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

// New thunk to add a visit
export const addVisit = createAsyncThunk(
  "patients/addVisit",
  async ({ patientId, visitData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/patients/${patientId}/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
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

export const deleteVisit = createAsyncThunk(
  "patients/deleteVisit",
  async ({ patientId, visitId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE_URL}/patients/${patientId}/visits/${visitId}`,
        {
          method: "DELETE",
        }
      );
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
  patients: [],
  nextId: null,
  isLoading: false,
  isError: null,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })

      // fetchNextId
      .addCase(fetchNextId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNextId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nextId = action.payload.nextId;
      })
      .addCase(fetchNextId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })

      // createPatient
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })

      // updatePatient
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.patients.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.patients[index] = action.payload;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // addVisit
      .addCase(addVisit.pending, (state) => {
        // Optionally, set a specific loading state for visits
      })
      .addCase(addVisit.fulfilled, (state, action) => {
        const patient = state.patients.find(
          (p) => p._id === action.payload._id
        );
        if (patient) {
          patient.visits = action.payload.visits;
        }
      })
      .addCase(addVisit.rejected, (state, action) => {
        state.isError = action.payload; // Use payload from rejectWithValue
      })
      
      // deleteVisit
      .addCase(deleteVisit.fulfilled, (state, action) => {
        const patient = state.patients.find(
          (p) => p._id === action.payload._id
        );
        if (patient) {
          patient.visits = action.payload.visits;
        }
      })
      .addCase(deleteVisit.rejected, (state, action) => {
        state.isError = action.payload;
      });
  },
});

export default patientSlice.reducer;
