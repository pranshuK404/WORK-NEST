import { Folder } from "../../models/folder.model.js";
import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getProjectFolderById = async (req, res) => {
  const { projectId, folderId } = req.params;
  const userId = req.user._id;

  const isProjectMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!isProjectMember) {
    throw new ApiError(403, "You are not a project member");
  }

  const folder = await Folder.findOne({
    _id: folderId,
    projectId,
  }).lean();

  if (!folder) {
    throw new ApiError(404, "Folder does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, folder, "Folder retrieved successfully"));
};
