import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS, // put all in env file
  },
});

export const sendMail = async (to, token) => {   //---WORK IS NEEDED
  await transporter.sendMail({
    from: '"MyApp" <no-reply@myapp.com>',
    to,
    subject: "Verify your email",
    html: `Verification otp: ${token}`,
  });
};



