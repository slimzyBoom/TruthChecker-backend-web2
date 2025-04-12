import mongoose, { Schema, Document } from "mongoose";

export interface ClaimDocument extends Document{
    claim: string;
    verdict: "Truth" | "Fake News" | "Uncertain";
    articles: {
        title: string;
        link: string;
        snippet: string;
        pubDate: string;
        source: string;
        category: string;
        image?: string | null;
    };
}

const ClaimSchema = new Schema({
    claim: { type: String, required: true },
    verdict: { type: String, enum: ["Truth", "Fake News", "Uncertain"], required: true },
    articles: {
        title: { type: String, required: true },
        link: { type: String, required: true, unique: true },
        snippet: { type: String, required: true },
        pubDate: { type: String, required: true },
        source: { type: String, required: true },
        category: { type: String, required: true },
        image: { type: String, required: false },
    }
}, {
    timestamps: true,
})

export const Claim = mongoose.model<ClaimDocument>("Claim", ClaimSchema);