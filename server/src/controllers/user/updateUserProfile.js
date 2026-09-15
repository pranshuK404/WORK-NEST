import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { fullname } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullname,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.toObject(),
        "User profile updated successfully",
      ),
    );
};
