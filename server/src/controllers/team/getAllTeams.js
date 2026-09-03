import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getAllTeams = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const projectMember = Project.exists({
    _id: projectId,
    "members.user": userId,
  });

  if (!projectMember) {
    throw new ApiError(403, "You are not allowed to access");
  }

  const teams = await Team.find({ projectId }).populate(
    "members.user",
    "fullname email avatar",
  );

  if (teams.length === 0) {
    throw new ApiError(404, "Teams does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, teams, "Teams fetched successfully"));
};
