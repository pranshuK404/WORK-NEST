import { Project } from "../../models/project.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAllProjects = async (req, res) => {
  const userId = req.user._id;

  const projects = await Project.find({
    $or: [{ createdBy: userId }, { members: { $elemMatch: { user: userId } } }],
  }).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
};
