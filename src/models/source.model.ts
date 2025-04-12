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
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    snippet: { type: String, required: true },
    pubDate: { type: String, required: false },
    source: { type: String, required: true },
    category: { type: String, required: true },
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
