import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getUserProfile = async (req, res) => {
  const user  = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.toObject(),
        "User profile fetched successfully",
      ),
    );
};
