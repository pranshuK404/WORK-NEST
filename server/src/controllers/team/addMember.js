import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const addMember = async (req, res) => {
  const { teamId, projectId } = req.params;
  const userId = req.user._id;

  const { email, role } = req.body;

  const projectMember = await Project.exists({
    _id: projectId,
    members: {
      $elemMatch: { user: userId, role: { $in: ["admin", "manager"] } },
    },
  });

  if (!projectMember) {
    throw new ApiError(
      403,
      "You are not authorized to add members to this team.",
    );
  }

  const applicant = await User.findOne({ email: email.toLowerCase() });

  if (!applicant) {
    throw new ApiError(404, "User does not exist.");
  }

  const team = await Team.findOne({ _id: teamId, project: projectId });

  if (!team) {
    throw new ApiError(404, "Team does not exist.");
  }
  const alreadyMember = team.teamMembers.some((member) =>
    member.user.equals(applicant._id),
  );

  if (alreadyMember) {
    throw new ApiError(409, "User is already a member of this team.");
  }

  team.teamMembers.push({ user: applicant._id, role: role });

  await team.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        team.toObject(),
        "Member added to team successfully",
      ),
    );
};
