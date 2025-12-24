import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./slice/patientsSlice";
import catagoryReducer from "./slice/catagorySlice";
import doctorReducer from "./slice/doctorSlice";
import accountingReducer from "./slice/accountingSlice";
import historyReducer from "./slice/historySlice";

const store = configureStore({
  reducer: {
    patient: patientReducer,
    catagory: catagoryReducer,
    doctor: doctorReducer,
    accounting: accountingReducer,
    history: historyReducer,
  },
});

export default store;
