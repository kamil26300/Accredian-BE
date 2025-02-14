import express from "express";
import {
  createReferral,
  getReferrals,
  getReferralById,
  updateReferralStatus,
  getReferralsByReferrer,
  getReferralStats,
} from "../controllers/referral.controller.js";

const router = express.Router();

// Create new referral
router.post("/", createReferral);

// Get all referrals
router.get("/", getReferrals);

// Get referral statistics
router.get("/stats", getReferralStats);

// Get referrals by referrer email
router.get("/referrer/:email", getReferralsByReferrer);

// Get specific referral by ID
router.get("/:id", getReferralById);

// Update referral status
router.patch("/:id/status", updateReferralStatus);

export default router;
