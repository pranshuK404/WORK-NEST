import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../../utils/auth/generateAccessRefreshTokens.js";
import { cookieOptions } from "../../utils/constants.js";

export const refreshAccessToken = async (req, res) => {
  const clientRefreshToken = req.cookies?.refreshToken.trim();
  if (!clientRefreshToken) {
    throw new ApiError(401, "Missing refresh token");
  }

  let decodedPayload;
  try {
    decodedPayload = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "invalid or expired refresh token");
  }

  const user = await User.findById(decodedPayload._id).select("+refreshToken");

  if (!user || user.refreshToken !== clientRefreshToken) {
    throw new ApiError(401, "Refresh token is not valid");
  }

  // Generate new jwt tokens and save the new refresh token in db
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 25 * 60 * 1000, // 25 min
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, {}, "New tokens have been set"));
};
