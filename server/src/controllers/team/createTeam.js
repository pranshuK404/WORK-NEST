import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createTeam = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const { teamName } = req.body;

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
    throw new ApiError(
      403,
      "You do not have permission to create a team for this project.",
    );
  }

  const team = await Team.create({
    createdBy: userId,
    projectId: projectId,
    teamName: teamName,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, team.toObject(), "Team created successfully"));
};
