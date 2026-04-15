import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../features/authSlice";
import { LoaderCircle } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle login (FIXED)
  const handleLogin = async (e) => {
    e.preventDefault(); // ⭐ VERY IMPORTANT

    if (!form.email || !form.password) return;

    try {
      await dispatch(loginUser(form)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-96 border border-zinc-800">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          Welcome Back
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoFocus
            className="w-full mb-4 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              "Login"
            )}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;