import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import ConnectionDB from "./config/db.js";

import userRoutes from "./routes/user.route.js"
import todoRoutes from "./routes/todo.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", userRoutes)
app.use("/api/todos", todoRoutes)

ConnectionDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}).catch((err) => {
  console.log("MongoDB connection error", err)
})