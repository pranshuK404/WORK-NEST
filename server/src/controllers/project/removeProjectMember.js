import { Project } from "../../models/project.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const removeProjectMember = async (req, res) => {
  const { projectId, memberId } = req.params;

  const activeProject = await Task.exists({
    projectId: projectId,
    assignees: memberId,
    status: {
      $in: ["pending", "in_progress"],
    },
  });

  if (activeProject) {
    throw new ApiError(
      400,
      "Member has active tasks in this project and cannot be removed",
    );
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      "members.user": memberId,
    },
    {
      $pull: {
        members: {
          user: memberId,
        },
      },
    },
    {
      new: true,
    },
  );
  if (!project) {
    throw new ApiError(
      404,
      "Project does not exist or member is not part of the project",
    );
  }
  await Task.updateMany(
    {
      projectId: projectId,
      assignees: memberId,
    },
    {
      $pull: {
        assignees: memberId,
      },
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, project.toJSON(), "Member removed from project"),
    );
};
