import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getProject = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project does not exists");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(400, "Project does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, project.toJSON()),
      "Project Fetched Successfully",
    );
};
