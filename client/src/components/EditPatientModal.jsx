import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory, createHistory } from "../store/slice/historySlice";

const HistoryField = React.memo(({ title, items, setItems, newItem, setNewItem, createAndAddItem, removeItem }) => (
    <div>
      <label className="block text-sm font-semibold mb-1">{title}</label>
      <div className="flex gap-2 flex-wrap mb-2">
        {items.map((item, idx) => (
          <span key={idx} className="bg-sky-100 text-sky-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            {item}
            <FiX className="cursor-pointer" onClick={() => removeItem(item, items, setItems)} />
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          list="historySuggestions"
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder={`Add ${title}`}
        />
        <button type="button" onClick={() => createAndAddItem(newItem, items, setItems, setNewItem)} className="px-3 py-2 bg-sky-500 text-white rounded-lg">
          <FiPlus />
        </button>
      </div>
    </div>
));

const EditPatientModal = ({
  isOpen,
  onClose,
  onSave,
  section,
  defaultValues = {},
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { list: historyList = [] } = useSelector((state) => state.history);

  const [presentHistory, setPresentHistory] = useState([]);
  const [newPresentHistory, setNewPresentHistory] = useState("");
  const [pastHistory, setPastHistory] = useState([]);
  const [newPastHistory, setNewPastHistory] = useState("");
  const [familyHistory, setFamilyHistory] = useState([]);
  const [newFamilyHistory, setNewFamilyHistory] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [newMedicalHistory, setNewMedicalHistory] = useState("");

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
      if (section === "history") {
        setPresentHistory(defaultValues.history?.presentHistory || []);
        setPastHistory(defaultValues.history?.pastHistory || []);
        setFamilyHistory(defaultValues.history?.familyHistory || []);
        setMedicalHistory(defaultValues.medicalHistory || []);
        dispatch(fetchHistory());
      }
    }
  }, [isOpen, defaultValues, reset, section, dispatch]);

  const createAndAddItem = useCallback(async (newItem, existingItems, setList, setNewItem) => {
    if (newItem.trim() && !existingItems.includes(newItem.trim())) {
      if (!historyList.some(h => h.historyName === newItem.trim())) {
        const res = await dispatch(createHistory({ historyName: newItem.trim(), subHistory: [] }));
        if (res.payload) {
          setList([...existingItems, res.payload.historyName]);
        }
      } else {
        setList([...existingItems, newItem.trim()]);
      }
      setNewItem("");
    }
  }, [dispatch, historyList]);

  const removeItem = useCallback((itemToRemove, existingItems, setList) => {
    setList(existingItems.filter(i => i !== itemToRemove));
  }, []);
  
  const submitHandler = (data) => {
    if (section === "history") {
      onSave({ 
        history: { presentHistory, pastHistory, familyHistory }, 
        medicalHistory 
      });
    } else {
      onSave(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><FiX size={22} /></button>
        <h2 className="text-xl font-bold mb-6 text-gray-800">
            {section === "general" && "Edit General Information"}
            {section === "history" && "Edit Patient History"}
        </h2>
        
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <datalist id="historySuggestions">
                {historyList.map((h) => ( <option key={h._id} value={h.historyName} /> ))}
            </datalist>

            {section === "history" && (
                <>
                    <HistoryField title="Present History" items={presentHistory} setItems={setPresentHistory} newItem={newPresentHistory} setNewItem={setNewPresentHistory} createAndAddItem={createAndAddItem} removeItem={removeItem} />
                    <HistoryField title="Past History" items={pastHistory} setItems={setPastHistory} newItem={newPastHistory} setNewItem={setNewPastHistory} createAndAddItem={createAndAddItem} removeItem={removeItem} />
                    <HistoryField title="Family History" items={familyHistory} setItems={setFamilyHistory} newItem={newFamilyHistory} setNewItem={setNewFamilyHistory} createAndAddItem={createAndAddItem} removeItem={removeItem} />
                    <HistoryField title="Medical History" items={medicalHistory} setItems={setMedicalHistory} newItem={newMedicalHistory} setNewItem={setNewMedicalHistory} createAndAddItem={createAndAddItem} removeItem={removeItem} />
                </>
            )}

            {section === "general" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Condition</label>
                    <input {...register("condition", { required: true })} className="w-full border rounded-lg px-3 py-2" placeholder="Condition লিখুন" />
                    {errors.condition && (<p className="text-red-500 text-xs mt-1">Condition is required</p>)}
                  </div>
    
                  <div>
                    <label className="block text-sm font-semibold mb-1">Duration</label>
                    <input {...register("duration")} className="w-full border rounded-lg px-3 py-2" placeholder="Duration লিখুন" />
                  </div>
                </>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600">Save</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;