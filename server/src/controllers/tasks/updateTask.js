import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const updateTask = async (req, res) => {
  const { taskId, projectId } = req.params;
  const userId = req.user._id;

  const { title, description, dueDate, priority } = req.body;

  if (
    title === undefined &&
    description === undefined &&
    dueDate === undefined &&
    priority === undefined
  ) {
    throw new ApiError(400, "Nothing to update");
  }

  const project = await Project.findById(projectId, {
    createdBy: 1,
    members: 1,
  }).lean();

  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const projectMember = project.members.find(
    (member) => member.user.toString() === userId.toString(),
  );

  if (!projectMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  const task = await Task.findOne({
    _id: taskId,
    projectId,
  });

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  const isManager = ["admin", "manager"].includes(projectMember.role);

  const isAssignee = task.assignees.some(
    (assignee) => assignee.toString() === userId.toString(),
  );

  if (!isManager && !isAssignee) {
    throw new ApiError(403, "You are not allowed to update this task");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (isManager && dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;

  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask.toJSON(), "Task updated successfully"),
    );
};
