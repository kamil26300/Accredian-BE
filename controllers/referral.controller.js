import prisma from "../config/db.js";
import { sendReferralEmail } from "../config/mailer.js";

export const createReferral = async (req, res) => {
  try {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

    // Validate input
    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(referrerEmail) || !emailRegex.test(refereeEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Create referral
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        status: "PENDING",
      },
    });

    // Send email notification
    try {
      await sendReferralEmail(refereeEmail, refereeName, referrerName);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue with the process even if email fails
    }

    res.status(201).json({
      success: true,
      data: referral,
      message: "Referral created successfully",
    });
  } catch (error) {
    console.error("Referral creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getReferrals = async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: referrals,
    });
  } catch (error) {
    console.error("Get referrals error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get referral by ID
export const getReferralById = async (req, res) => {
  try {
    const { id } = req.params;

    const referral = await prisma.referral.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!referral) {
      return res.status(404).json({
        success: false,
        error: "Referral not found",
      });
    }

    res.status(200).json({
      success: true,
      data: referral,
    });
  } catch (error) {
    console.error("Get referral by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Update referral status
export const updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "ACCEPTED", "COMPLETED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const updatedReferral = await prisma.referral.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedReferral,
    });
  } catch (error) {
    console.error("Update referral status error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get referrals by referrer email
export const getReferralsByReferrer = async (req, res) => {
  try {
    const { email } = req.params;

    const referrals = await prisma.referral.findMany({
      where: {
        referrerEmail: email,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: referrals,
    });
  } catch (error) {
    console.error("Get referrals by referrer error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getReferralStats = async (req, res) => {
  try {
    const stats = await prisma.$transaction([
      prisma.referral.count(),
      prisma.referral.count({
        where: {
          status: "COMPLETED",
        },
      }),
      prisma.referral.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: stats[0],
        completed: stats[1],
        pending: stats[2],
      },
    });
  } catch (error) {
    console.error("Get referral stats error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
