import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const removeMemberFromProject = async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user._id;

  const project = await Project.findOne({
    _id: projectId,
    members: {
      $elemMatch: {
        user: userId,
        role: { $in: ["admin", "manager"] },
      },
    },
  });

  if (!project) {
    throw new ApiError(403, "You are not allowed to remove project members");
  }

  const member = project.members.find((member) => member.user.equals(memberId));

  if (!member) {
    throw new ApiError(404, "Member not found in project");
  }

  // Don't allow removing project admin
  if (member.role === "admin") {
    throw new ApiError(400, "Cannot remove the project admin");
  }

  const teamMembership = await Team.exists({
    projectId,
    "teamMembers.user": memberId,
  });

  if (teamMembership) {
    throw new ApiError(409, "Remove member from their team first");
  }

  project.members.pull({ user: memberId });

  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Member removed from project successfully"),
    );
}
