import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(

    {
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

//=============================================================================================================//

// Prevent duplicate likes

likeSchema.index(
    {
        likedBy: 1,
        video: 1
    },
    {
        unique: true
    }
);

export const Like = mongoose.model("Like", likeSchema);