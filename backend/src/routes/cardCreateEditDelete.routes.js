import { Router } from "express"
import {
    all_cardRetrieve,
    editCard,
    cardDelete,
    cardRetrive,
    cardSubmit,
} from "../controllers/cardCreateEditDelete.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/createCard").post(verifyJWT, upload.fields([
    {
        name: "cardImage",
        maxCount: 1
    },
]), cardSubmit)
router.route("/yourCard").post(verifyJWT, cardRetrive)
router.route("/allCard").post(all_cardRetrieve)
router.route("/cardEdit/:id").post(verifyJWT, upload.fields([
    {
        name: "cardImage",
        maxCount: 1
    },
]), editCard)
router.route("/cardDelete/:id").post(verifyJWT, cardDelete)


export default router