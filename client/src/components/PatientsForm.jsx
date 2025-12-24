import React, { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  FiUser,
  FiClipboard,
  FiHeart,
  FiPlus,
  FiX,
  FiArrowLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createPatient, fetchNextId } from "../store/slice/patientsSlice";
import {
  fetchCatagory,
  createCatagory,
  updateCatagory,
} from "../store/slice/catagorySlice";
import { useNavigate } from "react-router-dom";

const TABS = ["Basic Info", "Symptoms", "History & Condition"];

const PatientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const { nextId, isLoading } = useSelector((state) => state.patient);
  const { list: categoryList = [] } = useSelector((state) => state.catagory);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientSerial: "",
      patientName: "",
      patientAge: "",
      patientMobile: "",
      patientDate: new Date().toISOString().split("T")[0],
      history: { presentHistory: "", pastHistory: "", familyHistory: "" },
      visits: [
        {
          date: new Date().toISOString().split("T")[0],
          problem: "",
          condition: "",
          duration: "",
          symtoms: { symtomsName: "", subSymtoms: [] },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "visits[0].symtoms.subSymtoms",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const selectedCategoryName = watch("visits[0].symtoms.symtomsName");

  const selectedCategory = useMemo(
    () => categoryList.find((c) => c.catagoryName === selectedCategoryName),
    [categoryList, selectedCategoryName]
  );

  useEffect(() => {
    dispatch(fetchNextId());
    dispatch(fetchCatagory());
  }, [dispatch]);

  useEffect(() => {
    if (nextId) {
      setValue("patientSerial", nextId);
    }
  }, [nextId, setValue]);

  const handleAddCategory = async () => {
    if (!categoryInput.trim()) return;
    const res = await dispatch(
      createCatagory({ catagoryName: categoryInput, subCatagory: [] })
    );
    if (res.payload) {
      setValue("visits[0].symtoms.symtomsName", res.payload.catagoryName);
      setCategoryInput(res.payload.catagoryName);
    }
  };

  const handleAddSubCategory = async () => {
    if (!subCategoryInput.trim() || !selectedCategory) return;
    const newSubCategory = { subCatagoryName: subCategoryInput };
    const updatedSubCategories = [
      ...selectedCategory.subCatagory,
      newSubCategory,
    ];
    await dispatch(
      updateCatagory({
        id: selectedCategory._id,
        subCatagory: updatedSubCategories,
      })
    );
    append({ subSymtomsName: subCategoryInput });
    setSubCategoryInput("");
  };

  const onSubmit = async (data) => {
    const res = await dispatch(createPatient(data));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/patients");
    } else {
      // Handle error
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Add New Patient</h1>
          <p className="text-sm text-gray-500">
            Follow the steps to add a new patient record.
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex p-2 bg-gray-100 rounded-t-lg">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === index
                  ? "bg-white text-sky-600 shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Tab Content */}
          <div className={activeTab === 0 ? "block" : "hidden"}>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <FiUser />
                Patient Details
              </h3>
              <input
                {...register("patientSerial")}
                readOnly
                className="input w-full"
                placeholder="Serial Number"
              />
              <input
                {...register("patientName", { required: "Name is required" })}
                className={`input w-full ${
                  errors.patientName ? "border-red-500" : ""
                }`}
                placeholder="Patient Full Name"
              />
              <input
                type="text"
                {...register("patientMobile", {
                  required: "Mobile number is required",
                })}
                className={`input w-full ${
                  errors.patientName ? "border-red-500" : ""
                }`}
                placeholder="Patient Mobile Number"
              />
              <input
                type="number"
                {...register("patientAge", { required: "Age is required" })}
                className={`input w-full ${
                  errors.patientAge ? "border-red-500" : ""
                }`}
                placeholder="Age"
              />
              <input
                type="date"
                {...register("patientDate")}
                className="input w-full"
              />
            </div>
          </div>

          <div className={activeTab === 1 ? "block" : "hidden"}>
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FiHeart />
              Symptoms
            </h3>
            <div className="flex items-center gap-2">
              <input
                list="categoryList"
                className="input w-full"
                placeholder="Type to find or create a symptom category"
                {...register("visits[0].symtoms.symtomsName", {
                  required: "Category is required",
                })}
                onInput={(e) => {
                  setCategoryInput(e.target.value);
                  setValue("visits[0].symtoms.symtomsName", e.target.value);
                }}
              />
              <datalist id="categoryList">
                {categoryList.map((c) => (
                  <option key={c._id} value={c.catagoryName} />
                ))}
              </datalist>
              {categoryInput &&
                !categoryList.some((c) => c.catagoryName === categoryInput) && (
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="button-primary"
                  >
                    <FiPlus />
                  </button>
                )}
            </div>

            {selectedCategory && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <input
                    list="subCategoryList"
                    className="input w-full"
                    placeholder="Type or select a sub-symptom"
                    value={subCategoryInput}
                    onInput={(e) => setSubCategoryInput(e.target.value)}
                  />
                  <datalist id="subCategoryList">
                    {selectedCategory.subCatagory.map((s, i) => (
                      <option key={i} value={s.subCatagoryName} />
                    ))}
                  </datalist>
                  <button
                    type="button"
                    onClick={() => {
                      if (subCategoryInput) {
                        append({ subSymtomsName: subCategoryInput });
                        setSubCategoryInput("");
                      }
                    }}
                    className="button-primary"
                  >
                    <FiPlus />
                  </button>
                  {subCategoryInput &&
                    !selectedCategory.subCatagory.some(
                      (s) => s.subCatagoryName === subCategoryInput
                    ) && (
                      <button
                        type="button"
                        onClick={handleAddSubCategory}
                        className="button-secondary"
                      >
                        Add New
                      </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span>{field.subSymtomsName}</span>
                      <button type="button" onClick={() => remove(index)}>
                        <FiX className="text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={activeTab === 2 ? "block" : "hidden"}>
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FiClipboard />
              History & Condition
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <textarea
                {...register("visits[0].problem")}
                className="input w-full"
                placeholder="Main Problem"
                rows="3"
              ></textarea>
              <input
                {...register("visits[0].condition")}
                className="input w-full"
                placeholder="Patient's Current Condition"
              />
              <input
                {...register("visits[0].duration")}
                className="input w-full"
                placeholder="Symptom Duration (e.g., '3 days')"
              />
              <input
                {...register("history.presentHistory")}
                className="input w-full"
                placeholder="Present Medical History"
              />
              <input
                {...register("history.pastHistory")}
                className="input w-full"
                placeholder="Past Medical History"
              />
              <input
                {...register("history.familyHistory")}
                className="input w-full"
                placeholder="Family Medical History"
              />
            </div>
          </div>

          {/* Navigation & Submit */}
          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab - 1)}
              disabled={activeTab === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
            >
              <FiArrowLeft /> Previous
            </button>

            {activeTab < TABS.length - 1 && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab + 1)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg"
              >
                Next <FiChevronsRight />
              </button>
            )}

            {activeTab === TABS.length - 1 && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400"
              >
                {isLoading ? "Saving..." : "Save Patient"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
