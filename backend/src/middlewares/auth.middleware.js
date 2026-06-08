import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // Steps to implement JWT verification:

  // 1. Extract the token from the Authorization header
  // 2. Verify the token using the secret key
  // 3. If valid, attach the user information to the request object
  // 4. Attach user information to request object
  // 5. Proceed to the next middleware or route handler

  try {
    //=============================================================================================================//

    // 1. Extract the token from the Authorization header

    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", ""); // Extract the token from the Authorization header or cookies

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided"); // Return an unauthorized error if no token is provided
    }

    //=============================================================================================================//

    // 2. Verify the token using the secret key

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token using the secret key

    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized: Invalid token"); // Return an unauthorized error if the token is invalid
    }

    //=============================================================================================================//

    // 3. Find the user associated with the token

    const user = await User.findById(decodedToken.userid).select(
      "-password -refreshToken"
    ); // Attach the user information to the request object, excluding sensitive fields like password and refreshToken

    if (!user) {
        throw new ApiError(
          401,
          "Unauthorized: User not found"
        ); // Return an unauthorized error if the user corresponding to the token's userId is not found in the database
    }

    //=============================================================================================================//

    // 4. Attach user information to request object
    
    req.user = user; // Attach the user information to the request object

    //=============================================================================================//

    // 5. Proceed to the next middleware or route handler

    next(); // Proceed to the next middleware or route handler
  } 

//=============================================================================================================//
  
catch (error) {

    throw new ApiError(401, error?.message || "Unauthorized: Token verification failed"); // Return an unauthorized error if any error occurs during token verification
  }
});
