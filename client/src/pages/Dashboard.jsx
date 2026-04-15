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
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(addTodo(text));
    setText("");
  };

  const handleToggle = (todo) => {
    dispatch(
      updateTodo({
        id: todo._id,
        data: { completed: !todo.completed },
      })
    );
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "Completed") return t.completed;
    if (filter === "Pending") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* 🔥 FULL PAGE LOADER */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <LoaderCircle className="animate-spin text-green-400" size={40} />
        </div>
      )}

      <div className="max-w-2xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Todo Dashboard
        </h1>

        {/* Add */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-4 rounded-lg text-black font-semibold"
          >
            Add
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

              <div className="flex gap-3">

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(todo)}
                  className={`px-3 py-1 rounded text-sm ${
                    todo.completed
                      ? "bg-yellow-500 text-black"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
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