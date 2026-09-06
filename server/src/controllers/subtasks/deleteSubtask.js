import { Team } from "../../models/team.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteSubtask = async (req, res) => {
  const { taskId, subtaskId, projectId } = req.params;
  const userId = req.user._id;

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
  const subtaskExists = task.subtasks.some((subtask) =>
    subtask._id.equals(subtaskId),
  );

  if (!subtaskExists) {
    throw new ApiError(404, "Subtask does not exist");
  }
  task.subtasks.pull(subtaskId);

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
};
