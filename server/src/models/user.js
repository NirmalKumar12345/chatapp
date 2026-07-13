import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    mobile:{
        type: String,
        required: true,
        trim: true
    },
    profilePic:{
        type: String,
        default: ""
    },
    bio:{
        type: String,
        default: ""
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastseen:{
        type: Date,
        default: Date.now
    },
    refreshToken: {
        type: String,
        default: null
    }
},{timestamps: true});

export default mongoose.model("User",userSchema);