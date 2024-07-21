import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { shareCard } from "../models/shareCard.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registration } from "../models/registration.models.js";
import { cardUpload } from "../models/cardUpload.models.js"
import { countCardShare } from "../models/coutCardShare.models.js";
import fs from 'fs';

//total count of card create by user and share by user and create card
const userTotalCountCreateShareByOther = asyncHandler(async (req, res) => {
    // Extract data from request body

    try {
        const userId = req.user._id;

        // Total cards created by the user
        const totalCreateCount = await cardUpload.countDocuments({ user: userId });

        // Total cards shared by the user
        const totalSharedByUser = await shareCard.countDocuments({ senderId: userId });

        // Total cards shared to the user
        const totalSharedToUser = await shareCard.countDocuments({ recipientId: userId });

        const totalCountShareAndCard = {
            //create total card count
            userCount: totalCreateCount,
            //share by user total count
            senderCount: totalSharedByUser,
            //share by other total coutn
            recipientCount: totalSharedToUser
        };

        // Respond with success message
        res.status(201).json(new ApiResponse(200, totalCountShareAndCard, "CreateCard and ShareCard and Recipient Total Count successfully"));
    } catch (error) {
        throw new ApiError(500, "Didnt Share Card and Create Card");
    }

});




export {
    userTotalCountCreateShareByOther,
}