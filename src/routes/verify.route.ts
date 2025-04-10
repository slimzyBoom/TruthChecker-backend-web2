import { Router } from "express";
import {
  verifyTextClaim,
  verifyImageClaim,
  verifyLinkClaim,
} from "../controllers/verify.controller";

const router = Router();

router.post("/text", verifyTextClaim);
router.post("/image", verifyImageClaim);
router.post("/link", verifyLinkClaim);

export default router;
