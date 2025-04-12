import { RequestHandler } from "express";
import { Claim } from "../models/claims.model";
import { checkForSimilarClaim } from "../services/compareClaim.service";
import { verifyClaimWithHuggingFace } from "../services/NPIconfirmClaim.service";
import { translateResponseText } from "../services/translateClaim.service";

export const verifyTextClaim: RequestHandler = async (req, res) => {
  const { claim } = req.body;
  const acceptedLang = req.headers["accept-language"]
    ?.split(",")[0]
    ?.toLowerCase();
  const supportedLangs = ["ig", "yo", "ha"];
  const userLang: "ig" | "yo" | "ha" | null =
    acceptedLang && supportedLangs.includes(acceptedLang)
      ? (acceptedLang as "ig" | "yo" | "ha")
      : null;
  if (!claim) return res.status(400).json({ message: "Claim is required" });

  try {
    const similarClaim = await checkForSimilarClaim(claim);
    if (similarClaim) {
      const existingClaim = await Claim.findById(similarClaim.similarClaimId);
      if (!existingClaim) {
        res.status(404).json({ message: "Claim not found" });
        return;
      }

      const translatedClaim = userLang
        ? await translateResponseText(existingClaim, userLang)
        : existingClaim;

      res
        .status(200)
        .json({ message: "Claim already exists", claim: translatedClaim });
      return;
    }

    const claimResult = await verifyClaimWithHuggingFace(claim);
    if (!claimResult) {
      res.status(404).json({ message: "Claim not found" });
      return;
    }
    const newClaim = await Claim.create(claimResult);
    if (!newClaim) {
      res.status(500).json({ message: "Failed to create claim" });
      return;
    }
    const translatedClaim = userLang
      ? await translateResponseText(newClaim, userLang)
      : newClaim;

    res.status(200).json({ message: "Claim verified", claim: translatedClaim });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const verifyLinkClaim: RequestHandler = async (req, res) => {
  res.json({ message: "Hello from link claim" });
};

