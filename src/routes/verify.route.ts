import { Router } from "express";
import {
  verifyTextClaim,
  verifyImageClaim,
  verifyLinkClaim,
} from "../controllers/verify.controller";
import handleLanguage from "../middleware/handleLanguage"; // Import the centralized middleware

const router = Router();

router.post("/text", handleLanguage, verifyTextClaim);
router.post("/image", handleLanguage, verifyImageClaim);
router.post("/link", handleLanguage, verifyLinkClaim);

export default router;