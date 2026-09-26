import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    conversation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String,
        trim: true,
        required: true
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    read:{
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false,
     },
    deleted: {
       type: Boolean,
       default: false,
    },
    replyTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message",
  default: null,
}
},{timestamps: true,});

export default mongoose.model("Message",messageSchema);