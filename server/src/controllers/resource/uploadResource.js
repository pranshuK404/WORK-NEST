import { Project } from "../../models/project.model.js";
import { Folder } from "../../models/folder.model.js";
import { Resource } from "../../models/resource.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createResource = async (req, res) => {
  const { projectId, folderId } = req.params;
  const userId = req.user._id;
  const { type, title, url } = req.body;
  const files = req.files ?? [];

  // Check resource type
  if (!["file", "link"].includes(type)) {
    throw new ApiError(400, 'Type must be "file" or "link"');
  }

  // Check project membership
  const isMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a project member");
  }

  // Check folder belongs to the project
  const folderExists = await Folder.exists({
    _id: folderId,
    projectId,
  });

  if (!folderExists) {
    throw new ApiError(404, "Folder not found");
  }

  // Create one link resource
  if (type === "link") {
    if (files.length || !title?.trim() || !url?.trim()) {
      throw new ApiError(400, "A title and URL are required for a link");
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      throw new ApiError(400, "Invalid URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new ApiError(400, "URL must use HTTP or HTTPS");
    }

    const resource = await Resource.create({
      projectId,
      folderId,
      createdBy: userId,
      type: "link",
      title: title.trim(),
      url: url.trim(),
    });

    return res.status(201).json(
      new ApiResponse(201, resource, "Link created successfully"),
    );
  }

  // Upload multiple files to Cloudinary
  if (!files.length) {
    throw new ApiError(400, "At least one file is required");
  }

  const uploadedFiles = await Promise.all(
    files.map((file) => uploadToCloudinary(file, projectId)),
  );

  // Save file details to MongoDB
  const resourcesToCreate = files.map((file, index) => ({
    projectId,
    folderId,
    createdBy: userId,
    type: "file",
    title: title || file.originalname,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    cloudinaryUrl: uploadedFiles[index].url,
    cloudinaryPublicId: uploadedFiles[index].publicId,
    cloudinaryResourceType: uploadedFiles[index].resourceType,
  }));

  const resources = await Resource.insertMany(resourcesToCreate);

  return res.status(201).json(
    new ApiResponse(201, resources, "Files uploaded successfully"),
  );
};