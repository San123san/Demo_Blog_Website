import { Router } from "express"
import {
    userTotalCountCreateShareByOther,
 } from "../controllers/totalCount.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()


router.route("/totalCardCount").post(verifyJWT, userTotalCountCreateShareByOther)


export default router