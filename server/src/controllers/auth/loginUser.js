import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "../../utils/auth/generateAccessRefreshTokens.js";
import { cookieOptions } from "../../utils/constants.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password ",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const sanitizedUser = user.toJSON();

  // Set cookies and send response to client
  res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, sanitizedUser, "User logged in successfully"));
};
