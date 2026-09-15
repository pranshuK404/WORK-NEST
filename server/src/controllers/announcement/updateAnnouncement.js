import { Project } from "../../models/project.model.js";
import { Announcement } from "../../models/announcement.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateAnnouncement = async (req, res) => {
  const { projectId, announcementId } = req.params;
  const userId = req.user._id;
  const { title, content, priority } = req.body;

  if (title === undefined && content === undefined && priority === undefined) {
    throw new ApiError(
      400,
      "At least one field is required to update the announcement",
    );
  }

  const projectMember = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to edit an announcement");
  }

  const announcement = await Announcement.findOne({
    _id: announcementId,
    projectId,
  });

  if (!announcement) {
    throw new ApiError(404, "Announcement does not exist");
  }

  if (title !== undefined) announcement.title = title;
  if (content !== undefined) announcement.content = content;
  if (priority !== undefined) announcement.priority = priority;

  const updatedAnnouncement = await announcement.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAnnouncement.toObject(),
        "Announcement updated successfully",
      ),
    );
};
