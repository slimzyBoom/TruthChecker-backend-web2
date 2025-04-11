import Claim from '../models/Claim';
import { Request, Response } from 'express';

export const createClaim = async (req: Request, res: Response) => {
  try {
    const claim = await Claim.create(req.body);
    res.status(201).json(claim);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create claim' });
  }
};

export const getClaims = async (_req: Request, res: Response) => {
  try {
    const claims = await Claim.find();
    res.json(claims);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch claims' });
  }
};

export const getClaim = async (req: Request, res: Response) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json(claim);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid claim ID' });
  }
};

export const verifyClaim = async (req: Request, res: Response) => {
  try {
    const { verificationResult } = req.body;
    if (!verificationResult) {
      return res.status(400).json({ error: 'Verification result is required' });
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'verified',
        verificationResult,
        verifiedBy: (req as any).adminId, // Ensure `adminId` is properly set in middleware
      },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json(claim);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to verify claim' });
  }
};