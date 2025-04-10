import { Request, Response } from "express";

export const verifyTextClaim = async (req: Request, res: Response) => {
  res.json({ message: "Hello from text claim" });
};

export const verifyImageClaim = async (req: Request, res: Response) => {
  res.json({ message: "Hello from image claim" });
};

export const verifyLinkClaim = async (req: Request, res: Response) => {
  res.json({ message: "Hello from link claim" });
};
