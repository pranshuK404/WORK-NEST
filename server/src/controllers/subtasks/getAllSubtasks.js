import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAllSubtasks = async (req, res) => {
  const { taskId, projectId } = req.params;
  const userId = req.user._id;

  const [projectMember, task] = await Promise.all([
    Project.exists({
      _id: projectId,
      "members.user": userId,
    }),
    Task.findOne({
      _id: taskId,
      projectId,
    })
      .select("subtasks")
      .lean(),
  ]);

  if (!projectMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task.subtasks, "Subtasks fetched successfully"));
};
