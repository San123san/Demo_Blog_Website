import mongoose from "mongoose";

const totalSchema = new mongoose.Schema({
    senderCount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shareCard', // Reference to the User model where sender details are stored
        required: true
    },
    recipientCount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shareCard', // Reference to the User model where recipient details are stored
        required: true
    },
    userCount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cardUpload', // Reference to the Card Upload model
        required: true
    },
},{timestamps: true})

export const countCardShare = mongoose.model("countCardShare",totalSchema)