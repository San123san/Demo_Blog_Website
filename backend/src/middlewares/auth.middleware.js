import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { registration } from "../models/registration.models.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        const token = req.headers["authorization"].split(" ")[1]
        console.log("Token:", token);
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await registration.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error); 
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})