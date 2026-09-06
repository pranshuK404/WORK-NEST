import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const assignTeamToTask = async (req, res) => {
  const { taskId, projectId, teamId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: {
        user: userId,
        role: { $in: ["admin", "manager"] },
      },
    },
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  // ****Team.exists() and Task.findOne() queries are independent, so you can run them in parallel**
  /*  If two async operations do not depend on each other, you can start them at the same time using Promise.all().*/

  const [teamExists, task] = await Promise.all([
    Team.exists({ _id: teamId, projectId }),
    Task.findOne({ _id: taskId, projectId }),
  ]);

  if (!teamExists) {
    throw new ApiError(404, "Team not found");
  }

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.assignedTeamId?.toString() === teamId) {
    throw new ApiError(400, "Task is already assigned to this team");
  }

  task.assignedTeamId = teamId;
  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTask.toObject(),
        "Team assigned to task successfully",
      ),
    );
};
