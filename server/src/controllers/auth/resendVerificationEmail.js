import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import {cryptoTokenUtility} from "../../utils/auth/cryptoToken.js";
import { sendMail } from "../../utils/sendMail.js";

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { rawToken, hashedToken, tokenExpiry } =
    await cryptoTokenUtility.generateToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save();

  await sendMail(email, rawToken);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification email sent"));
};
