import { Todo } from "../models/todo.model.js";

export const createTodo = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const todo = await Todo.create({
      text,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo,
    });

  } catch (error) {
    console.log("Create Todo error", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      todos,
    });

  } catch (error) {
    console.log("Get Todos error", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const todo = await Todo.findOne({ _id: id, user: req.user.id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // update fields if provided
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });

  } catch (error) {
    console.log("Update Todo error", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      todo
    });

  } catch (error) {
    console.log("Delete Todo error", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};