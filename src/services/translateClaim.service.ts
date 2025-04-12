import axios from "axios";
import { ClaimTypes } from "../types/Claim";

const HF_API_URL = process.env.HF_API_URL;

const languageModelMap: Record<string, string> = {
  ig: "Helsinki-NLP/opus-mt-en-ig",
  yo: "Helsinki-NLP/opus-mt-en-yo",
  ha: "Helsinki-NLP/opus-mt-en-ha",
};

const translateText = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  const model = languageModelMap[targetLanguage];
  if (!model) return text; // if no model is found default to english

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_URL}`,
          "Content-Type": "application/json",
        },
      }
    );
    const translated = response.data[0].translation_text;
    return translated || text; // return original text if translation fails;
  } catch (error) {
    const err = error as Error;
    console.error(`Translation failed for text: "${text}"`, err.message);
    return text; // return original text if translation fails
  }
};

export const translateResponseText = async (
    claim: ClaimTypes,
    targetLanguage: "ig" | "yo" | "ha"
): Promise<ClaimTypes> => {
    const translatedVerdict = await translateText(claim.verdict, targetLanguage)
    const translatedTitle = await translateText(claim.articles.title, targetLanguage)
    const translatedSnippet = await translateText(claim.articles.snippet, targetLanguage)
    return {
        ...claim,
        verdict: translatedVerdict,
        articles: {
            ...claim.articles,
            title: translatedTitle,
            snippet: translatedSnippet
        }
    }
}
