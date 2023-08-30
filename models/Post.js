import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [
        {type: Types.ObjectId, ref: "USER"}
    ],
    comments: [
        {
            text: String,
            postedBy: {type: Types.ObjectId, ref: "USER"}
        }
    ],
    postedBy: {
        type: Types.ObjectId,
        ref: "USER"
    }
}, {timestamps: true});

const Post = mongoose.model("POST", postSchema);

export default Post;