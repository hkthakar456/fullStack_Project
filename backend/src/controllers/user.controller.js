import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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

    console.log("STEP 1");

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

    console.log("STEP 2");

    const avatar = await uploadToCloudinary(avatarLocalPath, "videoTube/avatars"); // Upload the avatar image to Cloudinary and get the response which contains details about the uploaded file, including its URL, public ID, etc.
    const coverImage = coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath, "videoTube/coverImages") : null;  // Upload the cover image to Cloudinary only if a cover image file was provided in the request. If no cover image is uploaded, the coverImage variable will be set to null, and the user document will be created without a cover image URL.

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    
//===============================================================================================================//

    // 5. Create a new user object and save it to the database

    console.log("STEP 3");
    
    const user = await User.create({
        fullName,
        userName: userName.trim().toLowerCase(),           // It's good practice to ensure username is lowercase to avoid duplicates like 'Test' and 'test'
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage ? coverImage.secure_url : null,
    });  

//===============================================================================================================//

    // 6. remove password and refresh token from the response
    // 7. check if user created successfully
    
    console.log("STEP 4");
    
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

    console.log("LOGIN STEP 1");

    console.log("BODY =", req.body);

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

    console.log("LOGIN STEP 2");

    const isPasswordValid = await user.isPasswordCorrect(password); // Use the isPasswordCorrect method defined in the User model. Use user instead of User because User is mongoose model and user is the document instance retrieved from the database, which has access to the instance methods defined in the schema.

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password", [
            "The provided password is incorrect"
        ]);
    }

//===============================================================================================================//

    // 5. Generate access token and refresh token
    // 6. Save the refresh token in the database

    console.log("LOGIN STEP 3");

    const { accessToken, refreshToken } = await generatAccsessTokenAndRefreshToken(user._id); // Call the helper function to generate access and refresh tokens for the authenticated user and save the refresh token to the database. Pass the user's unique identifier (user._id) to the function to generate tokens specific to that user.

//===============================================================================================================//

    // 7. Return the access token and refresh token in the response as cookies and also include them in the response body for client-side use

    console.log("LOGIN STEP 4");

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // Fetch the logged-in user details from the database and exclude the password and refresh token fields from the response

    console.log("LOGIN STEP 5");

    const options = {
        httpOnly: true, // Set the cookie to be accessible only by the server to prevent client-side scripts from accessing it, which enhances security against XSS attacks
        secure: process.env.NODE_ENV === "production", // Set the cookie to be sent only over HTTPS connections to ensure that the token is encrypted during transmission
        sameSite: "strict", // Set the SameSite attribute to 'strict' to prevent the browser from sending the cookie along with cross-site requests, which helps protect against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // Set the cookie to expire after 7 days (in milliseconds)
    };

    console.log("LOGIN STEP 6");

    return res.status(200)
        .cookie("accessToken", accessToken, options) // Set the access token as a cookie in the response with the defined options for security and expiration
        .cookie("refreshToken", refreshToken, { ...options, maxAge: 10 * 24 * 60 * 60 * 1000 }) // Set the refresh token as a cookie with a longer expiration time than the access token
        .json(
            new ApiResponse(
                200, 
                "User logged in successfully", 
                {   user: loggedInUser,
                    accessToken
                }
            )
        ); // Return a JSON response with the logged-in user details, access token, and refresh token in the response body for client-side use so that the client can store the tokens in local storage or use them for subsequent API requests as needed.

}); 

const logoutUser = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to implement user logout:
    // 1. Get the user ID from the request object (set by the verifyJWT middleware)
    // 2. Clear the refresh token from the database for the user
    // 3. Clear the access token and refresh token cookies in the response
    // 4. Return a success response, if not throw an error

//===============================================================================================================//

    // 1. Get the user ID from the request object (set by the verifyJWT middleware)

    const userID = req.user._id; // The verifyJWT middleware attaches the authenticated user's information to the request object, so we can access the user's ID from req.user._id
    
//===============================================================================================================//

    // 2. Clear the refresh token from the database for the user

    await User.findByIdAndUpdate(
        userID,
        {
            $set: {
                refreshToken: null
            } // Clear the refresh token field in the user's document in the database to invalidate any existing refresh tokens for that user, effectively logging them out from all sessions.
        },
        {
            new: true, // Return the updated user document after the update operation is applied
            runValidators: false // Disable validation checks since we are only updating the refresh token field and not modifying any other user details that require validation
        }
    );

//===============================================================================================================//

    // 3. Clear the access token and refresh token cookies in the response

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0) // Set the cookie to expire immediately by setting the expiration date to a past date, which effectively clears the cookie from the client's browser
    };

    res.clearCookie("accessToken", options); // Clear the access token cookie by setting it with the same name and options but with an expiration date in the past
    res.clearCookie("refreshToken", options); // Clear the refresh token cookie in the same way

//===============================================================================================================//

    // 4. Return a success response, if not throw an error

    return res
        .status(200)
        .json(
            new ApiResponse(200, "User logged out successfully") // Return a JSON response with a success message indicating that the user has been logged out successfully
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to implement refresh access token:

    // 1. Get refresh token from cookies or request body
    // 2. Validate if refresh token exists
    // 3. Verify refresh token using JWT
    // 4. Find user associated with refresh token
    // 5. Check if refresh token matches the one stored in database
    // 6. Generate new access token and refresh token
    // 7. Save new refresh token in database
    // 8. Send new tokens in cookies and response

//===============================================================================================================//

    // 1. Get refresh token from cookies or request body

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken; // Try to get the refresh token from the cookies first, and if it's not available there, then check the request body. This allows flexibility in how the client can send the refresh token, either as a cookie or in the request body, depending on their implementation and security preferences.

//===============================================================================================================//

    // 2. Validate if refresh token exists

    if (!incomingRefreshToken) {

        throw new ApiError(
            401,
            "Refresh token is required"
        );
    } // If the incoming refresh token is not provided in either the cookies or the request body, throw an error with a 401 status code indicating that the refresh token is required for this operation.

//===============================================================================================================//

    try {

        // 3. Verify refresh token using JWT and decode its payload

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ); // Use the jwt.verify method to verify the incoming refresh token using the secret key defined in the environment variables. If the token is valid, it will return the decoded payload, which typically contains the user's ID and other relevant information. If the token is invalid or expired, it will throw an error that we can catch and handle appropriately.

//===============================================================================================================//

        // 4. Find the user associated with the decoded refresh token

        const user = await User.findById(
            decodedToken.userId
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        } // If no user is found in the database with the ID extracted from the decoded refresh token, it means the token is invalid or does not correspond to any existing user, so we throw an error with a 401 status code indicating that the refresh token is invalid.

//===============================================================================================================//

        // 5. Check if the incoming refresh token matches the one stored in database

        if (
            incomingRefreshToken !==
            user.refreshToken
        ) {
            throw new ApiError(
                401,
                "Refresh token is expired or already used"
            );
        } // If the incoming refresh token does not match the refresh token stored in the user's document in the database, it means the token has either expired or has already been used to refresh the access token, so we throw an error with a 401 status code indicating that the refresh token is expired or already used.

//===============================================================================================================//

        // 6. Generate new access token and refresh token
        // 7. Save new refresh token in database

        const {
            accessToken,
            refreshToken
        } = await generatAccsessTokenAndRefreshToken(
            user._id
        ); // Call the helper function to generate a new access token and refresh token for the user based on their ID. This function will also save the new refresh token in the database, replacing the old one, to ensure that only the most recently issued refresh token is valid for future token refresh operations.

//===============================================================================================================//

        // Configure cookie options for secure token storage

        const options = {
            httpOnly: true, // Prevent JavaScript access to cookies
            secure : process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
            sameSite: "strict", // Protect against CSRF attacks
        }; // Set the cookie options to enhance security by making the cookies HTTP-only, secure in production, and with SameSite attribute set to 'strict' to prevent cross-site request forgery (CSRF) attacks when sending the new access token and refresh token back to the client in the response cookies.

//===============================================================================================================//

        // 8. Send new access token and refresh token in cookies and response

        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                options
            )
            .cookie(
                "refreshToken",
                refreshToken,
                options
            )
            .json(
                new ApiResponse(
                    200,
                    "Access token refreshed successfully",
                    {
                        accessToken,
                    }
                )
            ); // Return a JSON response with the new access token in the response body for client-side use, and also set the new access token and refresh token as cookies in the response with the defined security options to ensure that the client can use the new tokens for subsequent API requests and that they are stored securely in the client's browser.

    } catch (error) {

        throw new ApiError(
            401,
            "Invalid refresh token",
            [
                error.message || "The provided refresh token is invalid, expired, or does not correspond to any existing user in the database"
            ]
        );
    } // If any error occurs during the token verification or user lookup process, we catch the error and throw a new ApiError with a 401 status code indicating that the refresh token is invalid, which could be due to an invalid token, an expired token, or a token that does not correspond to any existing user in the database.
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};