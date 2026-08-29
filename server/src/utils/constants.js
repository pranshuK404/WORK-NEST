export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "Lax", // Adjust as needed (e.g., "Strict" or "None")
};
