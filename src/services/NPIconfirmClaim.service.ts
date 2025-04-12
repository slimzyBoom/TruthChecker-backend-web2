import axios from "axios";
const HF_API_URL = process.env.HF_API_URL;
import { Article } from "../models/source.model";
import { ArticleDocument } from "../models/source.model";

interface ExtendArticleDocument extends ArticleDocument {
  decision: string;
}

export const verifyClaimWithHuggingFace = async (claim: string) => {
  const articles: ArticleDocument[] = await Article.find({});
  const results: ExtendArticleDocument[] = [];

  for (const article of articles) {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/FacebookAI/roberta-large-mnli",
      {
        inputs: {
          premise: article.snippet,
          hypothesis: claim,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_URL}`,
        },
      }
    );

    const output = response.data;
    const decision = output[0]?.label || "neutral";
    results.push({ ...article.toObject(), decision });
  }

  const supported = results.find((r) => r.decision === "entailment");
  const refuted = results.find((r) => r.decision === "contradiction");
  const neutral = results.find((r) => r.decision === "neutral");

  const verdict = supported
    ? "True"
    : refuted
    ? "Fake News"
    : "Uncertain";

   return {
    claim,
    verdict,
    article: supported || refuted || neutral || null,
  };
};
