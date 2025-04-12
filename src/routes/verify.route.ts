import { Router } from "express";
import { verifyTextClaim, verifyLinkClaim } from "../controllers/verify.controller";

const router = Router();

router.post("/text", verifyTextClaim);
router.post("/link", verifyLinkClaim);

export default router;
