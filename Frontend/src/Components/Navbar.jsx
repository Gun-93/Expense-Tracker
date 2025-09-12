import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Check token & user on route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
            💰 <span className="text-white">Expense</span>
            <span className="text-blue-300">Tracker</span>
          </Link>

          {/* Middle Nav Links (only if logged in) */}
          {isLoggedIn && (
            <div className="hidden md:flex space-x-8">
              <Link to="/dashboard" className="hover:text-blue-300 transition">
                Dashboard
              </Link>
              <Link to="/summary" className="hover:text-blue-300 transition">
                Summary
              </Link>
              <Link to="/starred" className="hover:text-yellow-300 transition">
                ⭐ Starred
              </Link>
            </div>
          )}

          {/* Right side buttons / Profile */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border border-white text-white hover:bg-white hover:text-blue-900 px-4 py-2 rounded-lg shadow-md transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="relative">
                {/* Profile Circle */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold hover:scale-105 transition"
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-44 p-3">
                    <p className="text-gray-700 font-semibold mb-2">👋 Hi, {user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}



