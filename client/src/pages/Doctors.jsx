import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors, createDoctor } from "../store/slice/doctorSlice";
import { FiPlus } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, isLoading, isError } = useSelector((state) => state.doctor);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(createDoctor(data)).unwrap();
      toast.success("Doctor added successfully!");
      reset();
    } catch (error) {
      toast.error(`Failed to add doctor: ${error}`);
    }
  };
  const medicalName = doctors.map((item) => item.medicalName);
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full flex flex-col items-center justify-center">
          <Link to="/" className="text-3xl md:text-4xl font-bold text-gray-800">
            {medicalName ? medicalName : "Mathura Homio Samadhan"}
          </Link>
          <p className="text-gray-600 mt-2">
            হোমিও চিকিৎসা নিন-আস্থা রাখুন-সুস্থ থাকুন
          </p>
        </div>
        {/* Doctor List */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Doctor List
          </h1>

          {isLoading && <p>Loading doctors...</p>}
          {isError && <p className="text-red-500">{isError}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Medical Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doctor.medicalName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-semibold">
                      {doctor.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-semibold">
                      {doctor.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-semibold">
                      {doctor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-semibold">
                      {doctor.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Doctor Form */}
        {doctors.length > 0 ? (
          <></>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiPlus /> Add New Doctor
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Medical Name
                </label>
                <input
                  {...register("medicalName", { required: true })}
                  className={`input w-full mt-1 ${
                    errors.medicalName ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., General Hospital"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Doctor Name
                </label>
                <input
                  {...register("doctorName", { required: true })}
                  className={`input w-full mt-1 ${
                    errors.doctorName ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., Dr. John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", { required: true, minLength: 6 })}
                  className={`input w-full mt-1 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Min 6 characters"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    Password must be at least 6 characters.
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Phone Number
                </label>
                <input
                  {...register("phone", { required: true })}
                  className={`input w-full mt-1 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., 01722440899"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  E-mail
                </label>
                <input
                  {...register("email", { required: true })}
                  className={`input w-full mt-1 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., demo@mail.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Address
                </label>
                <input
                  {...register("address", { required: true })}
                  className={`input w-full mt-1 ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., Bhulta Dhaka"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 disabled:bg-gray-400 transition"
              >
                Save Doctor
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
