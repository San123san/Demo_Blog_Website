import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { shareCard } from "../models/shareCard.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registration } from "../models/registration.models.js";
import { cardUpload } from "../models/cardUpload.models.js"
import fs from 'fs';

//share card
const whereToShare = asyncHandler(async (req, res) => {
    // Extract data from request body
    const { id } = req.params;
    const { usernameOremail, option } = req.body;


    try {
        if (!usernameOremail || !option) {
            throw new ApiError(400, "All Required");
        }

        // Find the logged-in user (sender) from req.user
        const sender = req.user;

        // Find the recipient by username or email
        const recipient = await registration.findOne({
            $or: [
                { username: usernameOremail },
                { email: usernameOremail }
            ]
        });

        if (!recipient) {
            throw new ApiError(404, "Recipient not found.");
        }

        // Find the card by its ObjectId
        const card = await cardUpload.findById(id);

        // Check if a shareCard document already exists for the same sender, recipient, and card
        let existingShareCard = await shareCard.findOne({
            senderId: sender._id,
            recipientId: recipient._id,
            cardId: card._id
        });

        if (existingShareCard) {
            // If a shareCard document already exists, return a message indicating it's already shared
            return res.status(200).json(new ApiResponse(200, existingShareCard, "This card is already shared."));
        }


        // Create a new shareCard document
        const newShareCard = new shareCard({
            senderId: sender._id,
            recipientId: recipient._id,
            cardId: card._id,
            senderRecipientNameInformation: usernameOremail,
            cardViewOrEdit: option
        });

        // Save the new shareCard document
        await newShareCard.save();

        // Respond with success message
        res.status(201).json(new ApiResponse(200, newShareCard, "Card shared successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to share card");
    }

});



//Sender or User share information
const shareSenderInforamtionRetrieve = asyncHandler(async (req, res) => {

    try {

        const senderId = req.user._id
        //Fetch all blogCard from the database


        const allShareCard = await shareCard.find({ senderId });
        //If no uploads found, return a 404 error
        if (!allShareCard || allShareCard.length === 0) {
            throw new ApiError(404, "No Card Found");
        }

        //Construct response
        const allShare = allShareCard.map(share => ({
            _id: share._id,
            senderUserId: share.senderId,
            usernameOremail_recipient_Id: share.recipientId,
            shareBlogCard: share.cardId,
            senderRecipientNameInformation: share.senderRecipientNameInformation,
            option: share.cardViewOrEdit,
            shareTime: share.sharedAt
        }));

        res.status(200).json(new ApiResponse(200, allShare, "All Share Blog Retrieve"));
    } catch (error) {
        throw new ApiError(404, "No Share Card")
    }
})

// Other edit your card
const shareOtherEdit = asyncHandler(async (req, res) => {

    const { id } = req.params
    const { description, topic, author, blogContent, category } = req.body
    // const { description, topic, author, blogContent, category } = req.body;
    const { cardImage } = req.files;
    const senderId = req.query.senderId
    const cardViewEdit = req.query.cardViewEdit
    const shareId = req.query.shareId

    try {
        const recipientId = req.user._id
        console.log("Rec" ,recipientId)
        console.log('Request Body:', req.body);
        console.log("CardId",req.params)

        if (cardViewEdit !== 'Edit') {
            throw new ApiError(403, "You are not authorized to edit this card");
        }
console.log('HI')
        // Check conditions for editing based on the shareCard model
        const shareCardEntry = await shareCard.findOne({
            _id: shareId,
            cardId: id,
            recipientId: recipientId,
            senderId: senderId,
            cardViewOrEdit: 'Edit' // Assuming 'cardViewOrEdit' is the field name in shareSchema
        });
        console.log("sharecardentry",shareCardEntry)
        console.log("sharecardentry")

        if (!shareCardEntry) {
            throw new ApiError(403, "You are not authorized to edit this card");
        }

        // Find the card upload by its ID
        let upload = await cardUpload.findById(id);

        // Update the card details
        if (cardImage) {
            // If a new image file is uploaded, update the cardImage field
            const imageBuffer = fs.readFileSync(cardImage[0].path);
            upload.cardImage = {
                data: imageBuffer,
                contentType: cardImage[0].mimetype
            };

            // Remove the temporary file uploaded
            fs.unlinkSync(cardImage[0].path);
        }

        // Update other fields if provided
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
        if (blogContent) {
            upload.blogContent = blogContent;
        }

        // Save the changes to the database
        await upload.save();

        // Respond with success message and updated card data
        res.status(200).json({
            status: 200,
            data: upload,
            message: "Card updated successfully"
        });
    } catch (error) {
        throw new ApiError(404, "Unable to Share")
    }
})



const shareYourOptionEdit = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params
        const { option } = req.body

        const editOption = await shareCard.findById(id)

        if (option) {
            editOption.cardViewOrEdit = option
        }

        await editOption.save()

        res.status(200).json(new ApiResponse(200, editOption, "Option update Successfully"))

    } catch (error) {
        throw new ApiError(404, "Can't edit the option")
    }
})

//Delete your share card
const shareYourCardDelete = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Find and delete the document where senderId matches userId and cardId matches id
        const deletedCard = await shareCard.findOneAndDelete({
            senderId: userId,
            cardId: id
        });

        if (!deletedCard) {
            throw new ApiError(404, 'Shared card not found');
        }

        res.status(201).json(new ApiResponse(200, deletedCard, "Share Card Successfully deleted"))
    } catch (error) {
        throw new ApiError(500, "Error Come during Delete your Share Card")
    }
})

// const shareToRevieveByRecipient = asyncHandler(async (req, res) => {

//     try {
//         const recipientId = req.user._id;

//         // Query to find all shareCard entries where recipientId matches req.user.id
//         const sharedCards = await shareCard.find({ recipientId });

//         // Check if any shared cards were found
//         if (sharedCards.length === 0) {
//             throw new ApiError(404, "No shared cards found for this recipient");
//         }

//         res.status(200).json(new ApiResponse(200, sharedCards, "RecipientRetrieveBlog"))

//     } catch (error) {
//         throw new ApiError(404, "No Information")
//     }
// })
const shareToRevieveByRecipient = asyncHandler(async (req, res) => {
    try {
        const recipientId = req.user._id;

        // Query to find all shareCard entries where recipientId matches req.user._id
        const sharedCards = await shareCard.find({ recipientId })
            .populate('cardId'); // Populate the cardId field with details from cardUpload model

        // Check if any shared cards were found
        if (sharedCards.length === 0) {
            throw new ApiError(404, "No shared cards found for this recipient");
        }

        // Transform cardImage to base64 format
        const transformedCards = sharedCards.map(card => ({
            ...card.toObject(),
            cardId: {
                ...card.cardId.toObject(),
                cardImage: {
                    data: card.cardId.cardImage.data.toString('base64'),
                    contentType: card.cardId.cardImage.contentType
                }
            }
        }));

        res.status(200).json(new ApiResponse(200,  transformedCards, "RecipientRetrieveBlog"));
    } catch (error) {
        throw new ApiError(404, "No Information");
    }
});



export {
    whereToShare,
    shareSenderInforamtionRetrieve,
    shareOtherEdit,
    shareYourOptionEdit,
    shareYourCardDelete,
    shareToRevieveByRecipient
}