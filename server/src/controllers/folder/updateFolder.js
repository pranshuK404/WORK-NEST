import { Folder } from "../../models/folder.model.js";
import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateFolder = async (req, res) => {
  const { projectId, folderId } = req.params;
  const userId = req.user._id;
  const { name } = req.body;

  const isProjectManager = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: {
        user: userId,
        role: { $in: ["admin", "manager"] },
      },
    },
  });

  if (!isProjectManager) {
    throw new ApiError(403, "You are not allowed to update this folder");
  }

  const folder = await Folder.findOneAndUpdate(
    { _id: folderId, projectId },
    { $set: { name } },
    { new: true, runValidators: true },
  );

  if (!folder) {
    throw new ApiError(404, "Folder does not exist in this project");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, folder.toObject(), "Folder updated successfully"),
    );
};
