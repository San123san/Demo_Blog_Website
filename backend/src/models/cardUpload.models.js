import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registration',
        required: true
    },
    username: {
        type: String // Include username field
    },
    cardImage: {
        data: Buffer, // Change data type to Buffer
        contentType: String // Store content type of the image
    },
    topic:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    author:{
        type: String,
        require: true
    },
    blogContent: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

export const cardUpload = mongoose.model("cardUpload",uploadSchema)