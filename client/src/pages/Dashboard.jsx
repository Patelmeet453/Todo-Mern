import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from "../features/taskSlice";
import { LoaderCircle, Pencil } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  const [text, setText] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleEdit = (todo) => {
    setText(todo.text);
    setEditId(todo._id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editId) {
      dispatch(updateTodo({ id: editId, data: { text } }));
      setEditId(null);
    } else {
      dispatch(addTodo(text));
    }

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
    <div className="min-h-screen bg-black text-white relative px-3 sm:px-0">

      {/* 🔥 LOADER */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <LoaderCircle className="animate-spin text-green-400" size={40} />
        </div>
      )}

      <div className="max-w-2xl mx-auto py-6">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6 text-center">
          Todo Dashboard
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-black font-semibold"
            >
              {editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setText("");
                }}
                className="w-full sm:w-auto bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* FILTER */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["All", "Completed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm ${filter === f
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800 text-gray-300"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No tasks available
          </p>
        )}

        {/* LIST */}
        <div className="space-y-3">
          {filtered.map((todo) => (
            <div
              key={todo._id}
              className="flex flex-wrap items-center gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800"
            >
              {/* TEXT */}
              <span
                onClick={() => handleToggle(todo)}
                className={`cursor-pointer flex-1 min-w-[150px] break-words ${todo.completed
                    ? "line-through text-gray-500"
                    : "text-white"
                  }`}
              >
                {todo.text}
              </span>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 flex-shrink-0">

                <button
                  onClick={() => handleEdit(todo)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleToggle(todo)}
                  className={`px-3 py-1 rounded text-xs sm:text-sm ${todo.completed
                      ? "bg-yellow-500 text-black"
                      : "bg-green-500 text-black"
                    }`}
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>

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