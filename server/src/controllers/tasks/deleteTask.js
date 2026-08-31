import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteTask = async (req, res) => {
  
  const { taskId, projectId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to delete task");
  }

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    projectId,
  });

  if (!deletedTask) {
    throw new ApiError(404, "Task does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
};
