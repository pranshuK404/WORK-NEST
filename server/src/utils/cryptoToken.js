import crypto from "crypto";

//----Token Generation Function----

const generateToken = (expiryInMinutes = 10) => {
  const rawToken = crypto.randomInt(100000, 1000000).toString();

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const tokenExpiry = Date.now() + expiryInMinutes * 60 * 1000;

  return {
    rawToken,
    hashedToken,
    tokenExpiry,
  };
};

// ----Hashing a token for comparison----
const hashUserToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const cryptoTokenUtility = {
  generateToken,
  hashUserToken,
};

export default cryptoTokenUtility;