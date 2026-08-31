import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const changeProjectMemberRole = async (req, res) => {
  const userId = req.user._id;
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
      createdBy: userId,
      "members.user": memberId,
    },
    {
      $set: {
        "members.$.role": role,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedProject) {
    throw new ApiError(
      404,
      "You are not authorized to change the role of member",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProject.toJSON(),
        "Project member role updated successfully",
      ),
    );
};
