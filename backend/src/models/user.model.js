import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; // for generating access and refresh tokens
import bcrypt from "bcrypt"; // for hashing passwords and comparing hashed passwords with plain text passwords

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            match: [/^\S+@\S+\.\S+$/, "Invalid Email"],
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudeinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudeinary url
        },
        watchHistory: [
            {
                video: {
                    type: Schema.Types.ObjectId,
                    ref: "Video",
                    required: true,
                },

                watchedAt: {
                    type: Date,
                    default: Date.now,
                },

                watchDuration: {
                    type: Number,
                    default: 0,
                },

                watchPercentage: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        searchHistory: [
            {
                query: {
                    type: String,
                    required: true,
                },
                searchedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        searchClickHistory: [
            {
                // Original Search Query

                query: {
                    type: String,
                    required: true,
                    trim: true,
                },

                // Clicked Video

                video: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Video",
                    required: true,
                },

                // Snapshot Of Category

                category: {
                    type: String,
                    trim: true,
                },

                // Snapshot Of Tags

                tags: [
                    {
                        type: String,
                        trim: true,
                    },
                ],

                // Snapshot Of Creator

                creator: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                // Click Time

                clickedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// userSchema.pre("save", async function () {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
// });
//

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
}); // Pre-save hook to hash the password before saving the user document

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}; // Method to compare a plain text password with the hashed password stored in the database. It returns true || false.

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            email: this.email,
            userId: this._id,
            userName: this.userName,
            fullName: this.fullName,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
        }
    );
}; // Method to generate a JWT access token for the user.

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            userId: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "15d",
        }
    );
}; // Method to generate a JWT refresh token for the user.

export const User = mongoose.model("User", userSchema);
