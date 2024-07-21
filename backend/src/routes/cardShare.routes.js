import { Router } from "express"
import {
    whereToShare,
    shareSenderInforamtionRetrieve,
    shareOtherEdit,
    shareYourOptionEdit,
    shareYourCardDelete,
    shareToRevieveByRecipient
} from "../controllers/cardShare.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()


router.route("/shareCardToOther/:id").post(verifyJWT, whereToShare)
router.route("/shareCardInformation").post(verifyJWT, shareSenderInforamtionRetrieve)
router.route("/shareOtherEditCard/:id").post(verifyJWT, 
    upload.fields([
    {
        name: "cardImage",
        maxCount: 1
    },
]),
 shareOtherEdit)
router.route("/shareCardOptioEditView/:id").post(verifyJWT, shareYourOptionEdit)
router.route("/shareCardByYouDelete/:id").post(verifyJWT, shareYourCardDelete)
router.route("/shareRecipient").post(verifyJWT, shareToRevieveByRecipient)


export default router