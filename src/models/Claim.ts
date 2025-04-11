import { Schema, model, Document } from 'mongoose';

interface IClaim extends Document {
    title: string;
    description: string;
    status: 'pending' | 'verified' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const ClaimSchema = new Schema<IClaim>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Claim = model<IClaim>('Claim', ClaimSchema);

export default Claim;