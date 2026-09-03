import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteTeam = async (req, res) => {
  const { teamId, projectId } = req.params;
  const userId = req.user._id;

  const projectMember = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to do the action");
  }

  const deletedTeam = await Team.findOneAndDelete({
    _id: teamId,
    project: projectId,
  });

  if (!deletedTeam) {
    throw new ApiError(404, "Team not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Team deleted successfully"));
};
