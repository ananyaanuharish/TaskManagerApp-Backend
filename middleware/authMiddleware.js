import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token using secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object (excluding password)
      req.user = await User.findById(decoded.userId).select("-password");

      // If user not found
      if (!req.user) {
        return res.status(401).json({ msg: "User not found" });
      }

      next(); // Proceed to the next middleware/route
    } catch (error) {
      console.error("Authentication Error:", error.message);
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    // If no token in header
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};

export default protect;
