import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All Fields Are Required." })
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ success: false, message: "User Already Registerd." })
    }

    const user = await User.create({
      name,
      email,
      password
    })

    user.password = undefined; // ✅ hide password

    res.status(201).json({ success: true, message: "User Register Successfully", user })

  } catch (error) {
    console.log("Signup Controller error", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All Fields Are Required." })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Credential" })
    }

    const checkPassword = await user.comparePassword(password)

    if (!checkPassword) {
      return res.status(400).json({ success: false, message: "Invalid Credential" })
    }

    // ✅ FIXED ORDER
    generateTokenAndSetCookie(res, user._id);

    user.password = undefined; // ✅ hide password

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
    });

  } catch (error) {
    console.log("Login Controller error", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}


export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });

  } catch (error) {
    console.log("Logout Controller error", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}


export const getme = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("Getme Controller error", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}