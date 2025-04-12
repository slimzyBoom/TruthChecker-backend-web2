import axios from "axios";
import { Claim } from "../models/claims.model";

const HF_API_URL = process.env.HF_API_URL;

export const checkForSimilarClaim = async (claim: string, threshold = 0.8) => {
  const previousClaims = await Claim.find({}).select("claim").lean();
  if (!previousClaims.length) return null;

  const response = await axios.post(
    "https://router.huggingface.co/hf-inference/pipeline/sentence-similarity/sentence-transformers/all-MiniLM-L6-v2",
    {
        inputs: {
            source_sentence: claim,
            sentences: previousClaims.map((c) => c.claim),
        }
    },
    {
        headers: {
            Authorization: `Bearer ${HF_API_URL}`,
            "Content-Type": "application/json",
        },
    }
);

    const scores: number[] = response.data;
    const bestIndex = scores.indexOf(Math.max(...scores));
    const bestScore = scores[bestIndex];
    if(bestScore >= threshold){
        const similarClaim = previousClaims[bestIndex]
        return {
            similarClaimId: similarClaim._id,
        }
    }
    return null;
};
