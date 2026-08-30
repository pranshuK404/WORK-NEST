import { User } from "../../models/user.model.js";
import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const addMemberToProject = async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project does not exists");
  }

  if (
    project.members.find(
      (member) => member.user.toString() === user._id.toString(),
    )
  ) {
    throw new ApiError(400, "User is already a member of this project");
  }

  project.members.push({ user: user._id, role: "member" });

  const updatedProject = await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProject.toJSON(), "Member added to project"),
    );
};
