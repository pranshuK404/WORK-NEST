import { Team } from "../../models/team.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createSubtask = async (req, res) => {
  const { taskId, projectId } = req.params;
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

  task.subtasks.push({
    title,
    dueDate,
  });

  const updatedTask = await task.save();

  const createdSubtask = updatedTask.subtasks[updatedTask.subtasks.length - 1];

  return res
    .status(201)
    .json(new ApiResponse(201, createdSubtask, "Subtask created successfully"));
};
