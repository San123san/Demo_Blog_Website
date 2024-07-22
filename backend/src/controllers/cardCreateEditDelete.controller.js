import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { cardUpload } from "../models/cardUpload.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { registration } from "../models/registration.models.js";
import { shareCard } from "../models/shareCard.models.js";
import fs from 'fs';

// Controller function for uploading an image with description and topic
const cardSubmit = asyncHandler(async (req, res) => {
    // Extract data from request body
    const { topic, author, category, description, blog } = req.body;
    const { cardImage } = req.files;

    try {
        // Check if memoryImage is provided
        if (!description && !topic && !author && !blog && !category) {
            throw new ApiError(400, " All Required");
        }

        // Read the image file and convert it to a Buffer
        const imageBuffer = fs.readFileSync(cardImage[0].path);

        // Fetch user details from registration model based on user ID
        const user = await registration.findById(req.user._id);

        // Create a new instance of Upload model
        const newUpload = new cardUpload({
            user: req.user._id,
            username: user.username,
            cardImage: {
                data: imageBuffer,
                contentType: cardImage[0].mimetype
            },
            description: req.body.description,
            topic: req.body.topic,
            author: req.body.author,
            blogContent: req.body.blogContent,
            category: req.body.category,
        });

        // Save the upload instance to the database
        await newUpload.save();

        // Remove temporary image file
        fs.unlinkSync(cardImage[0].path);

        // Respond with success message
        res.status(201).json(new ApiResponse(200, newUpload, "Card Create successfully"));
    } catch (error) {
        // In case of any error, handle it and respond with an error message
        throw new ApiError(500, error.message || "Failed to upload card");
    }
});

const cardRetrive = asyncHandler(async (req, res) => {
    try {

        //Fetch images belonging to the logged-in user
        const uploads = await cardUpload.find({ user: req.user._id });

        //If no upload found, return a 404 error
        if (!uploads || uploads.length === 0) {
            throw new ApiError(404, "Not Found");
        }

        //Contruct response with image details including upload date and time
        const yourCard = uploads.map(upload => ({
            _id: upload._id,
            cardImage: {
                data: upload.cardImage.data.toString('base64'),  //Convert Buffer to base64 string
                // data: upload.memoryImage.data,
                contentType: upload.cardImage.contentType
            },
            description: upload.description,
            topic: upload.topic,
            author: upload.author,
            blogContent: upload.blogContent,
            category: upload.category,
            uploadTime: upload.uploadTime
        }));

        res.status(200).json(new ApiResponse(200, yourCard, "Card retireve")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to retrieve card");
    }
});

const all_cardRetrieve = asyncHandler(async (req, res) => {
    try {
        //Fetch all images from the database
        const allUploads = await cardUpload.find();

        //If no uploads found, return a 404 error
        if (!allUploads || allUploads.length === 0) {
            throw new ApiError(404, "No Card Found");
        }

        //Construct response
        const allcard = allUploads.map(upload => ({
            _id: upload._id,
            user: upload.user,
            username: upload.username,
            cardImage: {
                data: upload.cardImage.data.toString('base64'),  //Convert Buffer to base64 string
                // data: upload.memoryImage.data,
                contentType: upload.cardImage.contentType
            },
            description: upload.description,
            topic: upload.topic,
            author: upload.author,
            blogContent: upload.blogContent,
            category: upload.category,
            uploadTime: upload.uploadTime
        }));

        res.status(200).json(new ApiResponse(200, allcard, "All card retrieved"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to retrieve card");
    }
});


const editCard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { description, topic, author, blogContent, category } = req.body;
    const { cardImage } = req.files;

    try {
        //Find the image by its ID
        let upload = await cardUpload.findById(id);

        //update the image, topic and description
        if (cardImage) {
            const imageBuffer = fs.readFileSync(cardImage[0].path);
            upload.cardImage = {
                data: imageBuffer,
                contentType: cardImage[0].mimetype
            };
        }

        if (description) {
            upload.description = description;
        }
        if (topic) {
            upload.topic = topic;
        }
        if (author) {
            upload.author = author;
        }
        if (category) {
            upload.category = category;
        }
        if(blogContent){
            upload.blogContent = blogContent;
        }

        // Save the changes to the database
        await upload.save();
        
        //Update the information
        if (cardImage) {
            fs.unlinkSync(cardImage[0].path);
        }

        res.status(200).json(new ApiResponse(200, upload, "Card updated succesfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to update card")
    }
})

const cardDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {

         // Delete shareCard documents related to the cardId
         await shareCard.deleteMany({ cardId: id });

        //find the image by its id
        const upload = await cardUpload.findOneAndDelete({ _id: id });

        res.status(200).json(new ApiResponse(200, null, "Delete successfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to delete information")
    }
})


export {
    cardSubmit,
    cardRetrive,
    all_cardRetrieve,
    editCard,
    cardDelete
}