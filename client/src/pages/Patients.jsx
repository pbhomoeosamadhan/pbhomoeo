import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../store/slice/patientsSlice";
import { fetchDoctors } from "../store/slice/doctorSlice";

const Patients = () => {
  const dispatch = useDispatch();

  const { doctors } = useSelector((state) => state.doctor);
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const medicalName = doctors.map((item) => item.medicalName);

  const { patients, isLoading, isError } = useSelector(
    (state) => state.patient
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // 🔍 search filter logic
  const filteredPatients = patients.filter((patient) => {
    const searchText = search.trim().toLowerCase();

    return (
      patient.patientName?.toLowerCase().includes(searchText) ||
      patient.patientSerial?.toString().includes(searchText) ||
      patient.patientMobile?.includes(searchText)
    );
  });

  // 📅 date format function
  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {isError}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="w-full flex flex-col items-center justify-center">
          <Link to="/" className="text-3xl md:text-4xl font-bold text-gray-800">
            {medicalName ? medicalName : "Mathura Homio Samadhan"}
          </Link>
          <p className="text-gray-600 mt-2">
            হোমিও চিকিৎসা নিন-আস্থা রাখুন-সুস্থ থাকুন
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <input
            className="w-full sm:flex-1 px-4 py-2 text-gray-700 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            type="search"
            placeholder="Search by name or serial..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/form"
            className="whitespace-nowrap px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-transform transform hover:scale-105"
          >
            Add Patient
          </Link>
        </div>

        <div className="overflow-x-auto">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No patients found.</p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Add Patient" to get started.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.patientSerial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-semibold">
                      {patient.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {patient.patientMobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patient.patientDate)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`${patient.patientSerial}`}
                        className="text-sky-600 hover:text-sky-800 transition"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
