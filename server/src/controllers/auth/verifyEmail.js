import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse";
import cryptoTokenUtility from "../../utils/auth/cryptoToken.js";
import { generateAccessAndRefreshTokens } from "../../utils/auth/generateAccessRefreshTokens.js";
import { cookieOptions } from "../../utils/constants.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  const hashedUserToken = cryptoTokenUtility.hashUserToken(token);
  const user = await User.findOne({
    emailVerificationToken: hashedUserToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid verification token");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const verifiedUser = await user.save();

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(
      new ApiResponse(
        true,
        verifiedUser.toJSON(),
        "Email verified successfully",
      ),
    );
};
