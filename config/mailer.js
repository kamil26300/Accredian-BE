import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendReferralEmail = async (to, refereeName, referrerName) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `${referrerName} has referred you to Accredian!`,
      html: `
        <h1>Hello ${refereeName}!</h1>
        <p>${referrerName} thinks you'd be interested in Accredian's programs.</p>
        <p>Check out our courses and get up to ₹15,000 in referral bonus!</p>
        <a href="${process.env.FRONTEND_URL}">Explore Programs</a>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
