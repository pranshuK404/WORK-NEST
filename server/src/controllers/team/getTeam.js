import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getTeam = async (req, res) => {
  const { teamId, projectId } = req.params;
  const userId = req.user._id;

  const projectMember = Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to access");
  }

  const team = await Team.findOne({
    _id: teamId,
    projectId: projectId,
  }).populate("members.user", "fullname email avatar");

  if (!team) {
    throw new ApiError(404, "Team not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, team.toObject(), "Team fetched successfully"));
};
