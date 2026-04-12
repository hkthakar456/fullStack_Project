import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to implement user registration:

    // 1.get user details from frontend\
    // 2.validation - not empty
    // 3.check if already exist: username and email
    // 4.Handle file uploads for avatar and cover image using Multer middleware and upload them to Cloudinary
    // 5.creat user object - creat entry in database
    // 6.remove password and refresh token from the response
    // 7.check if user created successfully
    // 8.return response, if not throw an error

//===============================================================================================================//

    // throw new Error("🔥 TEST ERROR");
    console.log("🔥 INSIDE CONTROLLER"); // for debugging purposes

//===============================================================================================================//

    //1. Get user details from the request body

    const { fullName, userName, email, password } = req.body; // Destructure the user details from the request body

    // console.log(req.body);

    // console.log("User registration details:", { fullName, userName, email, password });

//===============================================================================================================//

    // 2. Validate the user details - check if any field is missing

    if (!fullName || !userName || !email || !password) {
        throw new ApiError(400, "All fields are required", [
            !fullName && "Full name is required",
            !userName && "Username is required",
            !email && "Email is required",
            !password && "Password is required"
        ]);
    }
    else{
        console.log("✅ User details validation passed");
    }

//===============================================================================================================//

    // 3. Check if a user with the same email or username already exists in the database

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });  // Query the database to find a user with the same email or username using the $or operator to check both fields in a single query for efficiency

    if (existingUser) {
        throw new ApiError(409, "User already exists", [
            existingUser.email === email && "Email is already registered",
            existingUser.userName === userName && "Username is already taken"
        ]);
    }

//===============================================================================================================//

    // 4. Handle file uploads for avatar and cover image using Multer middleware and upload them to Cloudinary

    // console.log("✅ Multer middleware executed, files available in req.files:", req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;  // Get the local file path of the uploaded avatar image from the request object using optional chaining to safely access nested properties and avoid errors if any part of the path is undefined
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath) : null;  // Upload the cover image to Cloudinary only if a cover image file was provided in the request. If no cover image is uploaded, the coverImage variable will be set to null, and the user document will be created without a cover image URL.

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    
//===============================================================================================================//

    // 5. Create a new user object and save it to the database

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),           // It's good practice to ensure username is lowercase to avoid duplicates like 'Test' and 'test'
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage ? coverImage.secure_url : null,
    });  

//===============================================================================================================//

    // 6. remove password and refresh token from the response
    // 7. check if user created successfully
    const createdUser = await User.findById(user._id).select("-password -refreshToken"); // Fetch the created user from the database and exclude the password and refresh token fields from the response

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

//===============================================================================================================//

    // 8. Return a success response with the created user details

    return res.status(201).json(

        new ApiResponse(201, "User registered successfully", createdUser) // Use the ApiResponse class to standardize the API response format
    ); // Return a JSON response with the created user details and a success message


});
 
export {
    registerUser
};