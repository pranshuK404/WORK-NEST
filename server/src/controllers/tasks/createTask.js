import { Task } from "../../models/task.model.js";
import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createTask = async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;
  const { title, description, dueDate, priority } = req.body;

  const project = await Project.findById(projectId, {
    createdBy: 1,
    members: 1,
  }).lean();

  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const member = project.members.find(
    (member) => member.user.toString() === userId.toString(),
  );

  if (!member) {
    throw new ApiError(403, "You are not a member of this project");
  }

  if (!["admin", "manager"].includes(member.role)) {
    throw new ApiError(403, "You do not have permission to create tasks");
  }

  const task = await Task.create({
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    createdBy: userId,
    projectId: projectId,
  });

  if (!task) {
    throw new ApiError(400, "Task could not be created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, task.toJSON(), "Task Created Successfully"));
};
