import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Summary from "./Pages/Summary";
import Starred from "./Pages/Starred";
import Footer from "./Components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-sky-100">
      <BrowserRouter>
        {/* ✅ Navbar */}
        <Navbar />

        {/* ✅ Main Content with flex-grow to push footer down */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/starred" element={<Starred />} />
          </Routes>
        </main>

        {/* ✅ Footer - Always sticks to bottom */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;


