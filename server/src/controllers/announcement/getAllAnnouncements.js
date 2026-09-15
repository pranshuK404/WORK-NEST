import { Project } from "../../models/project.model.js";
import { Announcement } from "../../models/announcement.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAllAnnouncements = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  const announcements = await Announcement.find({
    projectId,
  })
    .sort({ createdAt: -1 })
    .populate("createdBy", "fullname avatar")
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        announcements,
        "Announcements retrieved successfully",
      ),
    );
};
