import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F", "#FF4444", "#AA66CC"];
const MONTHLY_BUDGET = 5000;

export default function Summary() {
  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState(0);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Generate dynamic month options (current year)
  const generateMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => {
      const monthValue = String(i + 1).padStart(2, "0");
      return { value: `${currentYear}-${monthValue}`, label: new Date(currentYear, i).toLocaleString("default", { month: "long" }) };
    });
  };

  const fetchSummary = async (selectedMonth = "") => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/expenses/summary", {
        params: selectedMonth ? { month: selectedMonth } : {},
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary(res.data);
      const totalAmount = res.data.reduce((sum, cat) => sum + cat.total, 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error("Summary Fetch Error:", err.response?.data || err.message);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchSummary(month);
  }, [month, token]);

  const savings = MONTHLY_BUDGET - total;
  const isOverspending = savings < 0;

  return (
    <div className="p-6">
      {/* Header + Month Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-green-600 flex items-center gap-2">
          📊 Summary
        </h2>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded shadow"
        >
          <option value="">All Months</option>
          {generateMonthOptions().map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500">Loading summary...</p>}

      {/* Budget Status */}
      {!loading && summary.length > 0 && (
        <div
          className={`p-4 rounded mb-4 text-center font-semibold ${
            isOverspending
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {isOverspending
            ? `⚠ Overspent by ₹${Math.abs(savings)}`
            : `✅ Saved ₹${savings} this month`}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white shadow rounded overflow-hidden mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Total (₹)</th>
              <th className="py-3 px-4">Usage</th>
            </tr>
          </thead>
          <tbody>
            {!loading && summary.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No data available for this month
                </td>
              </tr>
            ) : (
              summary.map((item) => {
                const percentage = ((item.total / total) * 100).toFixed(1);
                return (
                  <tr key={item._id} className="border-b">
                    <td className="py-3 px-4 font-medium">{item._id}</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600">
                      ₹{item.total}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{percentage}%</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {summary.length > 0 && !loading && (
          <div className="flex justify-between items-center p-4 bg-gray-50 font-bold">
            <span>Total Spent</span>
            <span className="text-blue-600 text-lg">₹{total}</span>
          </div>
        )}
      </div>

      {/* Pie Chart Section */}
      {summary.length > 0 && !loading && (
        <div className="bg-white shadow rounded p-6 flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary}
                dataKey="total"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
              >
                {summary.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}










