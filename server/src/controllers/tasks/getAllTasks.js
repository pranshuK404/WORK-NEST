import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAllTasks = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  const tasks = await Task.find({ projectId }).lean();
  if (tasks.length === 0) {
    throw new ApiError(404, "Tasks does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
};
