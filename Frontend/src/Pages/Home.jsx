import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] text-center bg-sky-100">
      <div className="p-8 rounded-2xl shadow-lg max-w-2xl bg-white bg-opacity-80 backdrop-blur-md">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
          Welcome to Expense Tracker 💰
        </h1>

        {/* Tagline */}
        <p className="text-gray-700 text-lg mb-6">
          Track your expenses, get category-wise insights, and never miss your budget!
        </p>

        {/* Points Section */}
        <ul className="text-gray-900 text-lg text-left mb-6 space-y-2 font-medium">
          <li>✅ Track your daily, weekly & monthly expenses</li>
          <li>✅ Get category-wise insights for better budgeting</li>
          <li>✅ Stay on top of your savings goals</li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-blue-500 text-blue-800 px-6 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}




