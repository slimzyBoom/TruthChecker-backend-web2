import mongoose, { Document, Schema } from "mongoose";

export interface ArticleDocument extends Document {
  title: string;
  link: string;
  snippet: string;
  pubDate?: string;
  source: string;
  category?: string;
  image?: string | null;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    title: { type: String, required: false },
    link: { type: String, required: false, unique: true },
    snippet: { type: String, required: false },
    pubDate: { type: String, required: false },
    source: { type: String, required: false },
    category: { type: String, required: false },
    image: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model<ArticleDocument>(
  "Article",
  ArticleSchema
);
