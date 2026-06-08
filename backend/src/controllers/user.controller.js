import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generatAccsessTokenAndRefreshToken = async (userID) => {
    try {

       const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // Save the user document with the new refresh token without running validation checks since we are only updating the refresh token field.

        return { accessToken, refreshToken }; 

    } catch (error) {

        throw new ApiError(500, "Failed to generate tokens", [
            error.message || "An error occurred while generating tokens"

        ]);
    }
};


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

const loginUser = asyncHandler(async (req, res) => {
    
     // Steps (Algorithm) to implement user login:

    // 1.get user details from frontend
    // 2.validation - not empty
    // 3.check if user exist: username or email
    // 4.compare password
    // 5.generate access token and refresh token
    // 6.save refresh token in database
    // 7.return response by cookie, if not throw an error

//===============================================================================================================//

    // throw new Error("🔥 TEST ERROR");
    console.log("🔥 INSIDE CONTROLLER"); // for debugging purposes

//===============================================================================================================//

    // 1. Get user details from the request body

    const { userName, email, password } = req.body; // Destructure the user details from the request body

    // console.log(req.body);

    // console.log("User login details:", { userName, email, password });

//===============================================================================================================//

    // 2. Validate the user details - check if any field is missing

    if ((!userName && !email) || !password) {
        throw new ApiError(400, "Username or email and password are required", [
            !userName && !email && "Either username or email is required",
            !password && "Password is required"
        ]);
    }

//===============================================================================================================//

    //3. Check if a user with the provided username or email exists in the database

    const user = await User.findOne({
        $or: [{ email }, { userName: userName?.toLowerCase() }] 
    });  // Query the database to find a user with the provided email or username using the $or operator to check both fields in a single query for efficiency. The username is converted to lowercase to ensure case-insensitive matching.

    if (!user) {
        throw new ApiError(404, "User not found", [
            email && "No user found with the provided email",
            userName && "No user found with the provided username"
        ]);
    }

//===============================================================================================================//

    // 4. Compare the provided password with the stored hashed password in the database

    const isPasswordValid = await user.isPasswordCorrect(password); // Use the isPasswordCorrect method defined in the User model. Use user instead of User because User is mongoose model and user is the document instance retrieved from the database, which has access to the instance methods defined in the schema.

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password", [
            "The provided password is incorrect"
        ]);
    }

//===============================================================================================================//

    // 5. Generate access token and refresh token
    // 6. Save the refresh token in the database

    const { accessToken, refreshToken } = await generatAccsessTokenAndRefreshToken(user._id); // Call the helper function to generate access and refresh tokens for the authenticated user and save the refresh token to the database. Pass the user's unique identifier (user._id) to the function to generate tokens specific to that user.

//===============================================================================================================//

    // 7. Return the access token and refresh token in the response as cookies and also include them in the response body for client-side use

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // Fetch the logged-in user details from the database and exclude the password and refresh token fields from the response

    const options = {
        httpOnly: true, // Set the cookie to be accessible only by the server to prevent client-side scripts from accessing it, which enhances security against XSS attacks
        secure: true, // Set the cookie to be sent only over HTTPS connections to ensure that the token is encrypted during transmission
        sameSite: "strict", // Set the SameSite attribute to 'strict' to prevent the browser from sending the cookie along with cross-site requests, which helps protect against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // Set the cookie to expire after 7 days (in milliseconds)
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options) // Set the access token as a cookie in the response with the defined options for security and expiration
        .cookie("refreshToken", refreshToken, { ...options, maxAge: 10 * 24 * 60 * 60 * 1000 }) // Set the refresh token as a cookie with a longer expiration time than the access token
        .json(
            new ApiResponse(
                200, 
                "User logged in successfully", 
                { user: loggedInUser, accessToken, refreshToken }
            )
        ); // Return a JSON response with the logged-in user details, access token, and refresh token in the response body for client-side use so that the client can store the tokens in local storage or use them for subsequent API requests as needed.

}); 


export {
    registerUser,
    loginUser
};