import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from "../features/taskSlice";
import { LoaderCircle } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ NEW: action loading (for single item)
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleAddTodo = () => {
    if (!text.trim()) return;

    dispatch(addTodo(text));
    setText("");
  };

  const handleToggle = async (todo) => {
    setActionId(todo._id);

    await dispatch(
      updateTodo({
        id: todo._id,
        data: { completed: !todo.completed },
      })
    );

    setActionId(null);
  };

  const handleDelete = async (id) => {
    setActionId(id);

    await dispatch(deleteTodo(id));

    setActionId(null);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "Completed") return t.completed;
    if (filter === "Pending") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Todo Dashboard
        </h1>

        {/* Add Todo */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTodo();
          }}
          className="flex gap-2 mb-6"
        >
          <input
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Add a new task..."
            value={text}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className={`px-4 rounded-lg font-semibold flex items-center justify-center ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              "Add"
            )}
          </button>
        </form>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-6">
          {["All", "Completed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full ${
                filter === f
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800 text-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Global Loading */}
        {loading && tasks.length === 0 && (
          <p className="text-center text-gray-400">Loading...</p>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No tasks available
          </p>
        )}

        {/* List */}
        <div className="space-y-3">
          {filtered.map((todo) => (
            <div
              key={todo._id}
              className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800"
            >
              <span
                onClick={() => handleToggle(todo)}
                className={`cursor-pointer flex-1 ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-white"
                }`}
              >
                {todo.text}
              </span>

              <div className="flex items-center gap-3">

                {/* Toggle */}
                <button
                  disabled={actionId === todo._id}
                  onClick={() => handleToggle(todo)}
                  className={`px-3 py-1 rounded text-sm flex items-center justify-center ${
                    todo.completed
                      ? "bg-yellow-500 text-black"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {actionId === todo._id ? (
                    <LoaderCircle className="animate-spin" size={14} />
                  ) : todo.completed ? (
                    "Undo"
                  ) : (
                    "Done"
                  )}
                </button>

                {/* Delete */}
                <button
                  disabled={actionId === todo._id}
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  {actionId === todo._id ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    "✕"
                  )}
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;