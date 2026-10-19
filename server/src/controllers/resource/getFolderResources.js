import { Project } from "../../models/project.model.js";
import { Folder } from "../../models/folder.model.js";
import { Resource } from "../../models/resource.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getFolderResources = async (req, res) => {
  const { projectId, folderId } = req.params;
  const userId = req.user._id;

  const isMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a project member");
  }

  const folderExists = await Folder.exists({
    _id: folderId,
    projectId,
  });

  if (!folderExists) {
    throw new ApiError(404, "Folder not found");
  }

  const resources = await Resource.find({
    projectId,
    folderId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, resources, "Resources fetched successfully"));
};
