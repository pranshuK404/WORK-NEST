import { Team } from "../../models/team.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const toggleComplete = async (req, res) => {
  const { taskId, subtaskId, projectId } = req.params;
  const userId = req.user._id;

  const task = await Task.findOne({
    _id: taskId,
    projectId,
  });

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  const isTeamMember = await Team.exists({
    _id: task.assignedTeamId,
    projectId,
    "teamMembers.user": userId,
  });

  if (!isTeamMember) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  const subtask = task.subtasks.id(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask does not exist");
  }

  subtask.isCompleted = !subtask.isCompleted;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask status updated successfully"));
};
