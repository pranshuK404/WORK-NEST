import { Folder } from "../../models/folder.model.js";
import { Project } from "../../models/project.model.js";
import { Resource } from "../../models/resource.model.js";
import cloudinary from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteFolder = async (req, res) => {
  const { projectId, folderId } = req.params;
  const userId = req.user._id;

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
    throw new ApiError(403, "You are not allowed to delete this folder");
  }

  const folder = await Folder.findOne({ _id: folderId, projectId });

  if (!folder) {
    throw new ApiError(404, "Folder does not exist in this project");
  }

  const resources = await Resource.find({
    projectId,
    folderId,
  }).lean();

  const fileResources = resources.filter(
    (resource) => resource.cloudinaryPublicId,
  );

  const results = await Promise.allSettled(
    fileResources.map(async (resource) => {
      const result = await cloudinary.uploader.destroy(
        resource.cloudinaryPublicId,
        {
          resource_type: resource.cloudinaryResourceType,
        },
      );

      if (!["deleted", "not_found"].includes(result.result)) {
        throw new Error(`Cloudinary deletion failed for ${resource.title}`);
      }

      return resource._id;
    }),
  );

  const deletedIds = results.flatMap((result, index) =>
    result.status === "fulfilled" ? [result.value] : [],
  );

  const failed = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [
          {
            file: fileResources[index].originalName,
            reason: result.reason.message,
          },
        ]
      : [],
  );

  // Remove records for files already deleted from Cloudinary,
  // and link resources that don't require Cloudinary deletion.
  const safeToDeleteIds = [
    ...deletedIds,
    ...resources
      .filter((resource) => !resource.cloudinaryPublicId)
      .map((resource) => resource._id),
  ];

  if (safeToDeleteIds.length) {
    await Resource.deleteMany({
      _id: { $in: safeToDeleteIds },
      projectId,
      folderId,
    });
  }

  if (failed.length) {
    throw new ApiError(
      502,
      "Some files could not be deleted. Retry deleting the folder.",
      failed,
    );
  }

  await Folder.deleteOne({ _id: folderId, projectId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Folder deleted successfully"));
};
