import { Project } from "../../models/project.model.js";
import { Announcement } from "../../models/announcement.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAnnouncement = async (req, res) => {
  const { projectId, announcementId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  const announcement = await Announcement.findOne({
    _id: announcementId,
    projectId,
  })
    .populate("createdBy", "fullname avatar")
    .lean();

  if (!announcement) {
    throw new ApiError(404, "Announcement does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, announcement, "Announcement retrieved successfully"),
    );
};
