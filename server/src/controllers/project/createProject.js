import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createProject = async (req, res) => {
  const userId = req.user._id;
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const project = await Project.create({
    title: title,
    description: description,
    createdBy: userId,
    members: [{ user: userId, role: "admin" }],
  });
  
  return res
    .status(201)
    .json(
      new ApiResponse(201, project.toJSON(), "Project Created Successfully"),
    );
};
