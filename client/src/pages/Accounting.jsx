



import { useForm } from "react-hook-form";
import {useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChambTransactions,
  createTransaction,
  deleteTransaction,
} from "../store/slice/accountingSlice";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo, useState } from "react";

const Accounting = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector((state) => state.accounting);
  
const {chamId}=useParams();
console.log("chamId:", chamId); // chamId লগ করা হচ্ছে
  /* =======================
      FILTER STATES
  ======================= */
  const [filter, setFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =======================
      FORM
  ======================= */
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      doctor: chamId,
      type: "income",
    },
  });

  /* =======================
      FETCH DATA
  ======================= */
  useEffect(() => {
    dispatch(fetchChambTransactions(chamId));
  }, [dispatch]);

  /* =======================
      FILTER LOGIC
  ======================= */
  const filteredTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);

      if (filter === "today") {
        return tDate.getTime() === today.getTime();
      }

      if (filter === "weekly") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return tDate >= weekAgo && tDate <= today;
      }

      if (filter === "monthly") {
        return (
          tDate.getMonth() === today.getMonth() &&
          tDate.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "range" && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        return tDate >= from && tDate <= to;
      }

      return true;
    });
  }, [transactions, filter, fromDate, toDate]);

  /* =======================
      SUMMARY (FILTERED)
  ======================= */
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [filteredTransactions]);

  /* =======================
      SUBMIT
  ======================= */
  const onSubmit = async (data) => {
    try {
      await dispatch(createTransaction(data)).unwrap();
      toast.success("Transaction added!");
      reset({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: data.type,
      });
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  /* =======================
      DELETE
  ======================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await dispatch(deleteTransaction(id)).unwrap();
      toast.success("Transaction deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Accounting</h1>

      {/* =======================
          SUMMARY
      ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-100 p-6 rounded-xl">
          <h3>Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            ৳{totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl">
          <h3>Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ৳{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-sky-100 p-6 rounded-xl">
          <h3>Net Balance</h3>
          <p className="text-2xl font-bold text-sky-600">
            ৳{balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =======================
            TRANSACTIONS
        ======================= */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["today", "weekly", "monthly", "range"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded ${
                  filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {/* DATE RANGE */}
          {filter === "range" && (
            <div className="flex gap-2 mb-4">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="input"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="input"
              />
            </div>
          )}

          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t._id} className="border-b">
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.description}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="text-right font-semibold">
                    ৳{t.amount.toFixed(2)}
                  </td>
                  <td className="text-right">
                    <button onClick={() => handleDelete(t._id)}>
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =======================
            ADD FORM
        ======================= */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-bold mb-4 flex gap-2">
            <FiPlus /> Add Transaction
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input type="date" {...register("date")} className="input w-full" />
            <input
              {...register("description")}
              placeholder="Description"
              className="input w-full"
            />
            <input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              placeholder="Amount"
              className="input w-full"
            />
            <select {...register("type")} className="input w-full">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button disabled={isLoading} className="button-primary w-full">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
