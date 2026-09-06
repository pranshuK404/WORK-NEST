import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const deletedProject = await Project.findOneAndDelete({
    _id: projectId,
    createdBy: userId,
  });

  if (!deletedProject) {
    throw new ApiError(
      404,
      "Project not found or you do not have permission to delete it."
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Project deleted successfully."
    )
  );
};
