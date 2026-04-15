import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  //  Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    try {
      await dispatch(signupUser(form)).unwrap();
      navigate("/"); // redirect to login
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">

      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-96 border border-zinc-800">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          Create Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            autoFocus
            className="w-full mb-4 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
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
            className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center ${loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
              }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" size={18} />
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;