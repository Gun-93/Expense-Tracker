import { useEffect, useState } from "react";
import axios from "axios";

export default function Starred() {
  const [starredExpenses, setStarredExpenses] = useState([]);
  const token = localStorage.getItem("token");

  // ✅ Fetch starred expenses
  const fetchStarred = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expenses/starred`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStarredExpenses(res.data);
    } catch (err) {
      console.log("Starred Fetch Error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  };

  // ✅ Toggle star (un-star from starred page)
  const toggleStar = async (id) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/expenses/${id}/toggle-star`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Local state update so UI changes instantly
      setExpenses((prev) =>
        prev.map((exp) =>
          exp._id === id ? { ...exp, isStarred: res.data.isStarred } : exp
        )
      );
    } catch (err) {
      console.error("Toggle Star Error:", err.response?.data || err.message);
    }
  };


  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchStarred();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-yellow-500 mb-6">
        ⭐ Starred Expenses
      </h2>

      {starredExpenses.length === 0 ? (
        <p className="text-gray-500 text-center">No starred expenses yet.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-yellow-100 text-left">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Amount</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Date</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {starredExpenses.map((exp) => (
              <tr
                key={exp._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{exp.category}</td>
                <td className="py-3 px-4 text-center font-bold text-blue-600">
                  ₹{exp.amount}
                </td>
                <td className="py-3 px-4">{exp.description || "—"}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-500">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => toggleStar(exp._id)}>
                    {exp.isStarred ? "⭐" : "☆"}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



