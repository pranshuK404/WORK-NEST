import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const assignTeamLead = async (req, res) => {
  const { teamId, projectId, memberId } = req.params;
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

  const updatedTeam = await Team.findOneAndUpdate(
    {
      _id: teamId,
      project: projectId,
      "teamMembers.user": memberId,
    },
    {
      $set: {
        "teamMembers.$.role": "lead",
      },
    },
    {
      new: true,
    },
  );
  if (!updatedTeam) {
    throw new ApiError(404, "Team or member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTeam.toObject(),
        "Team lead assigned successfully",
      ),
    );
};
