import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // throw new Error("🔥 TEST ERROR");
    // Logic to register a new user
    
    // Steps to implement user registration:

    // 1.get user details from frontend\
    // 2.validation - not empty
    // 3.check if already exist: username and email
    // 4.Handle file uploads for avatar and cover image using Multer middleware and upload them to Cloudinary
    // 5.creat user object - creat entry in database
    // 6.remove password and refresh token from the response
    // 7.check if user created successfully
    // 8.return response, if not throw an error

    console.log("🔥 INSIDE CONTROLLER");

    //1. Get user details from the request body

    const { fullName, username, email, password } = req.body; // Destructure the user details from the request body

    console.log("User registration details:", { fullName, username, email, password });


    // 2. Validate the user details - check if any field is missing

    if (!fullName || !username || !email || !password) {
        throw new ApiError(400, "All fields are required", [
            !fullName && "Full name is required",
            !username && "Username is required",
            !email && "Email is required",
            !password && "Password is required"
        ]);
    }

    // 3. Check if a user with the same email or username already exists in the database

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        throw new ApiError(409, "User already exists", [
            existingUser.email === email && "Email is already registered",
            existingUser.userName === username && "Username is already taken"
        ]);
    }

    // 4. Handle file uploads for avatar and cover image using Multer middleware and upload them to Cloudinary

    const avataerLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avataerLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadToCloudinary(avataerLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }

    // 5. Create a new user object and save it to the database
    // 6. remove password and refresh token from the response
    // 7. check if user created successfully

    const User = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || null,
    });

    const createdUser = await User.findById(User._id).select("-password -RefreshToken"); // Fetch the created user from the database and exclude the password and refresh token fields from the response

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    // 8. Return a success response with the created user details

    return res.status(201).json(

        new ApiResponse(201, "User registered successfully", createdUser) // Use the ApiResponse class to standardize the API response format
    ); // Return a JSON response with the created user details and a success message


});

export {registerUser};