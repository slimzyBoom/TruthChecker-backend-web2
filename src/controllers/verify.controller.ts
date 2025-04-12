import { RequestHandler } from "express";
import { Claim } from "../models/claims.model";
import { ArticleTypes } from "../types/Article";
import { checkForSimilarClaim } from "../services/compareClaim.service";
import { verifyClaimWithHuggingFace } from "../services/NPIconfirmClaim.service";
import { translateResponseText } from "../services/translateClaim.service";
import * as ArticleParser from 'article-parser';

export const verifyTextClaim: RequestHandler = async (req, res) => {
  const { claim } = req.body;

  // Check for accept-language header and set userLang accordingly
  const acceptedLang = req.headers["accept-language"]
    ?.split(",")[0]
    ?.toLowerCase();
  const supportedLangs = ["ig", "yo", "ha"];
  const userLang: "ig" | "yo" | "ha" | null =
    acceptedLang && supportedLangs.includes(acceptedLang)
      ? (acceptedLang as "ig" | "yo" | "ha")
      : null;
  if (!claim) {
    res.status(400).json({ message: "Claim is required" });
    return;
  }

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

export const verifyUrlClaim: RequestHandler = async (req, res) => {
  const { url } = req.body;

  if(!url) {
    res.status(400).json({ message: "URL is required" });
    return;
  }

  // Check for accept-language header and set userLang accordingly
  const acceptedLang = req.headers["accept-language"]
    ?.split(",")[0]
    ?.toLowerCase();
  const supportedLangs = ["ig", "yo", "ha"];
  const userLang: "ig" | "yo" | "ha" | null =
    acceptedLang && supportedLangs.includes(acceptedLang)
      ? (acceptedLang as "ig" | "yo" | "ha")
      : null;

  try {
    const article = await ArticleParser.extract(url as string);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    const claimResult = await verifyClaimWithHuggingFace(article.content || "");
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
}

export const sendAllVerifiedClaims: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  try {
    const claims = await Claim.find({}).skip((pageNumber - 1) * limitNumber).limit(limitNumber).lean();
    const totalClaims = await Claim.countDocuments({});
    res.status(200).json({
      message: "Claims retrieved successfully",
      claims,
      totalClaims,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalClaims / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
}

