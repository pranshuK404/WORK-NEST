import { Project } from "../../models/project.model.js";
import { Announcement } from "../../models/announcement.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteAnnouncement = async (req, res) => {
  const { projectId, announcementId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to delete an announcement");
  }

  const deletedAnnouncement = await Announcement.findOneAndDelete({
    _id: announcementId,
    projectId,
  });

  if (!deletedAnnouncement) {
    throw new ApiError(404, "Announcement does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Announcement deleted successfully"));
};
