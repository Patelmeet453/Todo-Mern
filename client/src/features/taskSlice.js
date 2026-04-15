import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../api/axios";
import toast from "react-hot-toast";

/* ================= GET TODOS ================= */
export const fetchTodos = createAsyncThunk(
  "tasks/get",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/todos");
      return res.data.todos;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch todos";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ================= ADD TODO ================= */
export const addTodo = createAsyncThunk(
  "tasks/add",
  async (text, thunkAPI) => {
    try {
      const res = await API.post("/todos/create", { text });
      toast.success("Task added");
      return res.data.todo;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to add task";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ================= DELETE TODO ================= */
export const deleteTodo = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/todos/${id}`);
      toast.success("Task deleted");
      return id;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete task";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ================= UPDATE TODO ================= */
export const updateTodo = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await API.put(`/todos/${id}`, data);
      toast.success("Task updated");
      return res.data.todo;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update task";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(
          (t) => t._id !== action.payload
        );
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;