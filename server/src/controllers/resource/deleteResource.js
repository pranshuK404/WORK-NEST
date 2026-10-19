import cloudinary from "../../config/cloudinary.js";
import { Project } from "../../models/project.model.js";
import { Resource } from "../../models/resource.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteResource = async (req, res) => {
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
  });

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  // Link: delete directly from MongoDB
  if (resource.type === "link") {
    await Resource.deleteOne({ _id: resource._id });
  }

  // File: delete from Cloudinary first, then MongoDB
  else if (resource.type === "file") {
    const result = await cloudinary.uploader.destroy(
      resource.cloudinaryPublicId,
      {
        resource_type: resource.cloudinaryResourceType,
      },
    );

    if (!["deleted", "not_found"].includes(result.result)) {
      throw new ApiError(502, "Failed to delete file from Cloudinary");
    }

    await Resource.deleteOne({ _id: resource._id });
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Resource deleted successfully"),
  );
};