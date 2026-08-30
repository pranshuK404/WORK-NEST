import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    throw new ApiError(400, "Missing token");
  }
  if (!password) {
    throw new ApiError(400, "Enter new password");
  }
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  user.refreshToken = null;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successful, login with your new password",
      ),
    );
};
