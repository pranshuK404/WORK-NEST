import { Project } from "../../models/project.model.js";
import { Announcement } from "../../models/announcement.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createAnnouncement = async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;

  const { title, content, priority } = req.body;

  const projectMember = await Project.exists({
    _id: projectId,
    memebers: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to create an announcement");
  }

  const announcement = await Announcement.create({
    title: title,
    content: content,
    priority: priority,
    createdBy: userId,
    projectId: projectId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        announcement.toObject(),
        "Announcement created successfully",
      ),
    );
};
