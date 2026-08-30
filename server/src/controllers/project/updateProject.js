import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateProject = async (req, res) => {
  const { title, description } = req.body;
  const { projectId } = req.params;

  if (!title && !description) {
    throw new ApiError(400, "Nothing to update");
  }

  const updatedData = {};

  if (title !== undefined) {
    updatedData.title = title;
  }
  if (description !== undefined) {
    updatedData.description = description;
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: updatedData },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new ApiError(404, "Project does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, project.toJSON(), "Project Updated Successfully"),
    );
};
