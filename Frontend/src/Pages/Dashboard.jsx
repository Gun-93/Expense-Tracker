import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("2025-09"); // ✅ Default to September
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  
  
   // ✅ Base URL from environment (Netlify will inject this)
  const API_URL = import.meta.env.VITE_API_URL;
  


  // ✅ Fetch Expenses (always respects selectedMonth)
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const response = await axios.get(
        `${API_URL}/api/expenses${selectedMonth ? `?month=${selectedMonth}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    }
  };

  // ✅ Load data when month changes
  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  // ✅ Add New Expense
const addExpense = async (newExpense) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${API_URL}/api/expenses`, newExpense, {  // ✅ FIXED
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses(); // refresh current month list
  } catch (error) {
    console.error("ADD ERROR:", error);
  }
};


  // ✅ Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMonth) {
      alert("⚠ Please select a month before adding expense.");
      return;
    }

    const [year, month] = selectedMonth.split("-");
    let finalDate;
    if (formData.date) {
      finalDate = new Date(formData.date);
    } else {
      finalDate = new Date(Number(year), Number(month) - 1, 15);
    }

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      date: finalDate.toISOString(),
    };

    await addExpense(payload);
    setFormData({ category: "", amount: "", description: "", date: "" });
  };

  // ✅ Toggle Star
  const toggleStar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/expenses/${id}/toggle-star`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchExpenses();
    } catch (err) {
      console.log("Toggle Star Error:", err.response?.data);
    }
  };

  // ✅ Delete Expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.log("Delete Error:", err.response?.data);
    }
  };

  return (
    <div className="p-6">
      {/* ✅ Month Selector */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded shadow"
        >
          <option value="">Select Month</option>
          <option value="2025-01">January</option>
          <option value="2025-02">February</option>
          <option value="2025-03">March</option>
          <option value="2025-04">April</option>
          <option value="2025-05">May</option>
          <option value="2025-06">June</option>
          <option value="2025-07">July</option>
          <option value="2025-08">August</option>
          <option value="2025-09">September</option>
          <option value="2025-10">October</option>
          <option value="2025-11">November</option>
          <option value="2025-12">December</option>
        </select>
      </div>

      {/* ✅ Add Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="border p-2 rounded w-32"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 rounded flex-1"
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          ➕ Add
        </button>
      </form>

      {/* ✅ Expenses Table */}
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4 text-center">Amount</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4 text-center">Date</th>
            <th className="py-3 px-4 text-center">⭐</th>
            <th className="py-3 px-4 text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No expenses for this month
              </td>
            </tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{exp.category}</td>
                <td className="py-3 px-4 text-center font-bold text-blue-600">
                  ₹{exp.amount}
                </td>
                <td className="py-3 px-4">{exp.description || "—"}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-500">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleStar(exp._id)}
                    className={`text-2xl hover:scale-125 transition duration-200 ${
                      exp.isStarred ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => deleteExpense(exp._id)}
                    className="text-red-600 hover:text-red-800 text-xl"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}









  












