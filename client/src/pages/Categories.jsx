import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCatagory,
  createCatagory,
  updateCatagory,
} from "../store/slice/catagorySlice";
import { FiPlus, FiTag, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchDoctors } from "../store/slice/doctorSlice";
import { Link } from "react-router-dom";

const Categories = () => {
  const { doctors } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  const medicalName = doctors.map((item) => item.medicalName);
  const {
    list: categories,
    isLoading,
    isError,
  } = useSelector((state) => state.catagory);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      catagoryName: "",
      subCatagory: [{ subCatagoryName: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCatagory",
  });

  useEffect(() => {
    dispatch(fetchCatagory());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(createCatagory(data)).unwrap();
      toast.success("Category added successfully!");
      reset();
    } catch (error) {
      toast.error(`Failed to add category: ${error}`);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="grid grid-cols-1  gap-6">
        <div className="w-full flex flex-col items-center justify-center">
          <Link to="/" className="text-3xl md:text-4xl font-bold text-gray-800">
            {medicalName ? medicalName : "Mathura Homio Samadhan"}
          </Link>
          <p className="text-gray-600 mt-2">
            হোমিও চিকিৎসা নিন-আস্থা রাখুন-সুস্থ থাকুন
          </p>
        </div>
        {/* Category List */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Category List
          </h1>

          {isLoading && <p>Loading categories...</p>}
          {isError && <p className="text-red-500">{isError}</p>}

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg">{category.catagoryName}</h3>
                <ul className="list-disc ml-6 mt-2">
                  {category.subCatagory.map((sub, index) => (
                    <li key={index} className="text-sm">
                      {sub.subCatagoryName}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Form */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiPlus /> Add New Category
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Category Name
              </label>
              <input
                {...register("catagoryName", { required: true })}
                className={`input w-full mt-1 ${
                  errors.catagoryName ? "border-red-500" : ""
                }`}
                placeholder="e.g., Fever"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Sub-categories
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mt-2">
                  <input
                    {...register(`subCatagory.${index}.subCatagoryName`, {
                      required: true,
                    })}
                    className="input w-full"
                    placeholder={`Sub-category ${index + 1}`}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    <FiTrash2 className="text-red-500" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ subCatagoryName: "" })}
                className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:underline mt-2"
              >
                <FiPlus /> Add Sub-category
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 disabled:bg-gray-400 transition"
            >
              Save Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Categories;
