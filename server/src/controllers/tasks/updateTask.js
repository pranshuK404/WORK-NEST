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
    throw new ApiError(
      400,
      "At least one field is required to update the task",
    );
  }

  const [isManagerOrAdmin, task] = await Promise.all([
    Project.exists({
      _id: projectId,
      members: {
        $elemMatch: {
          user: userId,
          role: { $in: ["admin", "manager"] },
        },
      },
    }),
    Task.findOne({
      _id: taskId,
      projectId,
    }).select("-subtasks"),
  ]);

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  if (!isManagerOrAdmin) {
    throw new ApiError(403, "You are not allowed to update this task");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;

  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask.toObject(), "Task updated successfully"),
    );
};
