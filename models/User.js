import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    follower: [
        {
            type: Types.ObjectId,
            ref: "USER"
        }
    ],
    following: [
        {
            type: Types.ObjectId,
            ref: "USER"
        }
    ],
});

const User = mongoose.model("USER", userSchema);

export default User