import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(
      decodedToken.userId
    ).select("-password -refreshToken");

    req.user = user || null;

    next();
  } catch {
    req.user = null;
    next();
  }
};