import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudeinary url
            required: true,
        },
        thumbnail: {
            type: String, // cloudeinary url
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // cloudeinary url
            required: true,
        }, // Video duration in seconds
        // This will be automatically fetched from Cloudinary
        views: {
            type: Number,
            default: 0,
        },
        likesCount: {
            type:Number,
            default:0
        },
        commentsCount: {
            type:Number,
            default:0
        },
        tags: [{
            type: String,
        }],
        category:{
            type: String,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
        VideoOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);