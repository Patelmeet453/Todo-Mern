import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id: userId }

    next();

  } catch (error) {
    console.log("Auth Middleware error", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid Token",
    });
  }
};