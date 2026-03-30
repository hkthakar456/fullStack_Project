import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
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
        avatar:{
            type: String, // cloudeinary url
            required: true,
        },
        converImage:{
            type: String, // cloudeinary url
        },
        watchHistory:{
            typr: Schema.Types.ObjectId,
            ref: 'Video',
        },
        Password: {
            type: String,
            required: [true, "Password is required"],
        },
        RefreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    if (this.isModified("Password")) {
        this.Password = await bcrypt.hash(this.Password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.Password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            email: this.email,
            userId: this._id,
            name: this.name,
            fullName: this.fullName,
        }, 

        process.env.ACCESS_TOKEN_SECRET, 
        
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1D' 
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { 
            userId: this._id
        }, 

        process.env.REFRESH_TOKEN_SECRET, 
        
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '10D' 
        }
    );
};

export const User = mongoose.model('User', userSchema);