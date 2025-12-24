import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiX, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCatagory,
  createCatagory,
  updateCatagory,
} from "../store/slice/catagorySlice";

const AddVisitModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const dispatch = useDispatch();
  const { list: categoryList = [] } = useSelector((state) => state.catagory);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      problem: "",
      condition: "",
      duration: "",
      symtoms: {
        symtomsName: "",
        subSymtoms: [],
      },
      prescriptions: [{ name: "", dose: "" }],
      ...initialData,
    },
  });

  const {
    fields: subSymptomFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control,
    name: "symtoms.subSymtoms",
  });

  const {
    fields: prescriptionFields,
    append: appendPrescription,
    remove: removePrescription,
  } = useFieldArray({
    control,
    name: "prescriptions",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const selectedCategoryName = watch("symtoms.symtomsName");

  const selectedCategory = useMemo(
    () => categoryList.find((c) => c.catagoryName === selectedCategoryName),
    [categoryList, selectedCategoryName]
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCatagory());
      reset({
        date: new Date().toISOString().split("T")[0],
        ...initialData,
      });
    }
  }, [isOpen, dispatch, reset]);

  const handleAddCategory = async () => {
    if (!categoryInput.trim()) return;
    const res = await dispatch(
      createCatagory({ catagoryName: categoryInput, subCatagory: [] })
    );
    if (res.payload) {
      setValue("symtoms.symtomsName", res.payload.catagoryName);
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
    appendSub({ subSymtomsName: subCategoryInput });
    setSubCategoryInput("");
  };

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl m-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add New Visit</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <FiX className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input
            type="date"
            {...register("date", { required: true })}
            className="input w-full"
          />
          <textarea
            {...register("problem", { required: true })}
            rows={2}
            className="input w-full"
            placeholder="Problem"
          />
          <input
            type="text"
            {...register("condition")}
            className="input w-full"
            placeholder="Condition"
          />
          <input
            type="text"
            {...register("duration")}
            placeholder="e.g. 1 week"
            className="input w-full"
          />

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Main Symptom
            </label>
            <div className="flex items-center gap-2">
              <input
                list="categoryList"
                className="input w-full"
                placeholder="Type to find or create a symptom category"
                {...register("symtoms.symtomsName")}
                onInput={(e) => {
                  setCategoryInput(e.target.value);
                  setValue("symtoms.symtomsName", e.target.value);
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
              <div className="mt-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Sub-symptoms
                </label>
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
                        appendSub({ subSymtomsName: subCategoryInput });
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {subSymptomFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span>{field.subSymtomsName}</span>
                      <button
                        type="button"
                        onClick={() => removeSub(index)}
                        className="p-1 rounded-full hover:bg-red-100"
                      >
                        <FiX className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prescriptions */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Prescriptions
            </label>
            {prescriptionFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  {...register(`prescriptions.${index}.name`)}
                  placeholder="Medicine Name"
                  className="input flex-1"
                />
                <input
                  type="text"
                  {...register(`prescriptions.${index}.dose`)}
                  placeholder="Dose"
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removePrescription(index)}
                  className="p-1 rounded-full hover:bg-red-100"
                >
                  <FiX className="text-red-500" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendPrescription({ name: "", dose: "" })}
              className="flex items-center gap-1 text-sm text-sky-600 mt-1"
            >
              <FiPlus /> Add Prescription
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Save Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitModal;
