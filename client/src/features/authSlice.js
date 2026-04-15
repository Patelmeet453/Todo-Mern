import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../api/axios";
import toast from "react-hot-toast";

/* ================= SIGNUP ================= */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/auth/signup", data);
      toast.success("Registered successfully");
      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", data);
      toast.success("Login successful");
      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await API.post("/auth/logout"); // clears cookie
    toast.success("Logged out");
  }
);

/* ================= CHECK AUTH ================= */
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/auth/me");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    checkingAuth: true,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* SIGNUP */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      /* CHECK AUTH */
      .addCase(checkAuth.pending, (state) => {
        state.checkingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.checkingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.checkingAuth = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;