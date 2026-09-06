import { Team } from "../../models/team.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const editSubtask = async (req, res) => {
  const { taskId, subtaskId, projectId } = req.params;
  const userId = req.user._id;
  const { title, dueDate } = req.body;

  const task = await Task.findOne({
    _id: taskId,
    projectId,
  });

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }
  const teamLeader = await Team.exists({
    _id: task.assignedTeamId,
    projectId,
    teamMembers: {
      $elemMatch: { user: userId, role: "lead" },
    },
  });
  if (!teamLeader) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  const subtask = task.subtasks.id(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask does not exist");
  }

  if (title !== undefined) subtask.title = title;
  if (dueDate !== undefined) subtask.dueDate = dueDate;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask updated successfully"));
};
