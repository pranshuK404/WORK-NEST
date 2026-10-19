import { Project } from "../../models/project.model.js"
import { Resource } from "../../models/resource.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getResourceById = async (req, res) => {
  const { projectId, resourceId } = req.params;
  const userId = req.user._id;

  const isMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a project member");
  }

  const resource = await Resource.findOne({
    _id: resourceId,
    projectId,
  }).lean();

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  return res.status(200).json(
    new ApiResponse(200, resource, "Resource fetched successfully"),
  );
};