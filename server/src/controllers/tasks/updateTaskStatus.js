import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateTaskStatus = async (req, res) => {
  const { taskId, projectId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const [isProjectMember, task] = await Promise.all([
    Project.exists({
      _id: projectId,
      "members.user": userId,
    }),
    Task.findOne({
      _id: taskId,
      projectId,
    }),
  ]);

  if (!isProjectMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  if (!task.assignedTeamId) {
    throw new ApiError(400, "Task is not assigned to a team");
  }
  const isTeamLead = await Team.exists({
    _id: task.assignedTeamId,
    projectId,
    teamMembers: {
      $elemMatch: { user: userId, role: "lead" },
    },
  });

  if (!isTeamLead) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  task.status = status;

  if (status === "completed") {
    task.completedAt = Date.now();
  } else {
    task.completedAt = null;
  }

  const updatedTask = await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask.toObject(), "Task status updated"));
};
