import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { checkAuth } from "./features/authSlice";
import { LoaderCircle } from "lucide-react";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();
  const { user, checkingAuth } = useSelector((state) => state.auth);

  // ✅ Check auth on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  // ⏳ wait until auth is checked
  if (checkingAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">

        <LoaderCircle
          className="animate-spin text-green-500 mb-4"
          size={40}
        />

        <p className="text-gray-400 text-sm">
          Checking authentication...
        </p>

      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        {/* Register */}
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/dashboard" /> : <Register />
          }
        />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard /> : <Navigate to="/" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;