import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateTask = async (req, res) => {
  const { taskId, projectId } = req.params;
  const userId = req.user._id;

  const { title, description, dueDate, priority, status } = req.body;

  if (
    title === undefined &&
    description === undefined &&
    dueDate === undefined &&
    priority === undefined &&
    status === undefined
  ) {
    throw new ApiError(
      400,
      "At least one field is required to update the task",
    );
  }

  const [project, task] = await Promise.all([
    Project.findOne({
      _id: projectId,
      "members.user": userId,
    })
      .select(" members ")
      .lean(),

    Task.findOne({
      _id: taskId,
      projectId,
    }).select("-subtasks").lean(),
  ]);

  if (!project) {
    throw new ApiError(403, "You are not a member of this project");
  }

  const isManagerOrAdmin = project.members.some(
    (member) =>
      member.user.toString() === userId.toString() &&
      ["admin", "manager"].includes(member.role),
  );

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  let isTeamLead = false;

  if (task.assignedTeamId) {
    isTeamLead = await Team.exists({
      _id: task.assignedTeamId,
      projectId,
      teamMembers: {
        $elemMatch: {
          user: userId,
          role: "lead",
        },
      },
    });
  }

  if (!isManagerOrAdmin && !isTeamLead) {
    throw new ApiError(403, "You are not allowed to update this task");
  }

  if (isManagerOrAdmin) {
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
  }

  if (isTeamLead && status !== undefined) {
    task.status = status;

    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }
  }

  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask.toObject(), "Task updated successfully"),
    );
};
