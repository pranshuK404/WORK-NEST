import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { cookieOptions } from "../../utils/constants.js";

export const logoutUser = async (req, res) => {
  const user = req?.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { refreshToken: null },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, " User Logout successful"));
};
