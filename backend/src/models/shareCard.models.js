import mongoose from "mongoose";

// const cardSchema = new mongoose.Schema({
const shareSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registration', // Reference to the User model where sender details are stored
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registration', // Reference to the User model where recipient details are stored
        required: true
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cardUpload', // Reference to the Card Upload model
        required: true
    },
    senderRecipientNameInformation: {
        type: String,
        required: true
    },
    shareBlogCard: {
        type: String,
    },
    cardViewOrEdit: {
        type: String,
        // enum: ['view', 'edit'],
        required: true
    },
    sharedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

// export const shareCard = mongoose.model("shareCard",cardSchema)
export const shareCard = mongoose.model("shareCard",shareSchema)