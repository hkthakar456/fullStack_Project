import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(

    {

        //=============================================================================================================//

        // User who follows creator

        follower: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        //=============================================================================================================//

        // Creator being followed

        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },

    {
        timestamps: true,
    }
);

//=============================================================================================================//

// Prevent duplicate follows

followSchema.index(
    {
        follower: 1,
        creator: 1,
    },
    {
        unique: true,
    }
);

export const Follow = mongoose.model("Follow", followSchema);