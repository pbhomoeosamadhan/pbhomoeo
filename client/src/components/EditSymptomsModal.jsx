import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCatagory,
  createCatagory,
  updateCatagory,
} from "../store/slice/catagorySlice";

const EditSymptomsModal = ({ isOpen, onClose, onSave, defaultValues }) => {
  const dispatch = useDispatch();
  const { list: categoryList = [] } = useSelector((state) => state.catagory);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "symtoms.subSymtoms",
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
      reset(defaultValues);
      setCategoryInput(defaultValues.symtoms.symtomsName || "");
    }
  }, [isOpen, dispatch, reset, defaultValues]);

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
    append({ subSymtomsName: subCategoryInput });
    setSubCategoryInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Symptoms</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <FiX className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              list="categoryList"
              className="input w-full"
              placeholder="Symptom Category"
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
              <div className="flex flex-wrap gap-2 mt-2">
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

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="button-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSymptomsModal;
