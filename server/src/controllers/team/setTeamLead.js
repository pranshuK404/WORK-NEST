import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const setTeamLead = async (req, res) => {
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

  const team = await Team.findOne({
    _id: teamId,
    projectId,
    "teamMembers.user": memberId,
  });

  if (!team) {
    throw new ApiError(404, "Team or member not found");
  }

  // Find existing lead, if any
  const currentLead = team.teamMembers.find((member) => member.role === "lead");

  // Demote old lead only if one exists
  if (currentLead) {
    currentLead.role = "member";
  }

  // Find and promote selected member
  const newLead = team.teamMembers.find(
    (member) => member.user.toString() === memberId.toString(),
  );

  if (!newLead) {
    throw new ApiError(404, "Selected member not found in the team");
  }

  newLead.role = "lead";
  const updatedTeam = await team.save();

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
