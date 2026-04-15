import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await dispatch(logoutUser());
      navigate("/");
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-zinc-900 border-b border-zinc-800 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-green-400 cursor-pointer hover:text-green-300 transition"
        >
          TodoApp
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* User */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">
              <span className="text-green-400 font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
              <span className="text-gray-300 text-sm">
                {user.name || user.email}
              </span>
            </div>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-green-500 hover:bg-green-600 transition text-black px-4 py-1.5 rounded-lg text-sm font-semibold"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;