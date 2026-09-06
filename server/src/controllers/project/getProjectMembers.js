import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getProjectMembers = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const project = await Project.findOne({
    _id: projectId,
    "members.user": userId,
  })
    .select("members")
    .populate("members.user", "name email avatar")
    .lean();

  if (!project) {
    throw new ApiError(404, "Project not found or you are not a member");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        project.members,
        "Project members fetched successfully",
      ),
    );
};
