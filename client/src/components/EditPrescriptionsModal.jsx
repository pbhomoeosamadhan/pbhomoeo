import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

const EditPrescriptionsModal = ({ isOpen, onClose, onSave, defaultValues }) => {
  const { register, handleSubmit, control } = useForm({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptions",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Prescriptions
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <FiX className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2">
              <input
                {...register(`prescriptions.${index}.name`)}
                className="input col-span-2"
                placeholder="Medicine Name"
              />
              <input
                {...register(`prescriptions.${index}.dose`)}
                className="input"
                placeholder="Dose"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="col-span-3 button-danger"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ name: "", dose: "" })}
            className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:underline mt-2"
          >
            <FiPlus /> Add Prescription
          </button>
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

export default EditPrescriptionsModal;
