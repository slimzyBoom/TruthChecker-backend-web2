import { Router } from "express";
import {
  verifyTextClaim,
  verifyUrlClaim,
  sendAllVerifiedClaims
} from "../controllers/verify.controller";

const router = Router();

router.post("/text", verifyTextClaim);
router.post("/link", verifyUrlClaim);
router.get("/all", sendAllVerifiedClaims);

export default router;
