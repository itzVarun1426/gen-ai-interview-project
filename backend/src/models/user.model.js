import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email already exists"]
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    targetRole: {
        type: String,
        default: ""
    },
    experienceLevel: {
        type: String,
        enum: ["Junior", "Mid-Level", "Senior", "Lead / Principal", "Executive", ""],
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;