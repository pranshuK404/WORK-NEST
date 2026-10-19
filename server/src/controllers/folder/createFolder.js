import { Folder } from "../../models/folder.model.js";
import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createFolder = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;
  const { name } = req.body;
  const isProjectManager = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!isProjectManager) {
    throw new ApiError(403, "You are not allowed to create a folder");
  }

  const folder = await Folder.create({
    name: name,
    createdBy: userId,
    projectId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, folder.toObject(), "Folder Created Successfully"),
    );
};
