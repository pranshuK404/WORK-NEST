import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//---Importing project Validation Schema
import {
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
  addMemberToProjectSchema,
  removeMemberFromProjectSchema,
  getProjectMembersSchema,
  changeProjectMemberRoleSchema,
  getProjectSchema,
} from "../validators/project.validator.js";

//---Importing project controllers
import {
  createProject,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  getProjectMembers,
  changeProjectMemberRole,
  getProject,
  getAllProjects,
} from "../controllers/project/0index.js";

const router = Router();

// mapping project routes

router.post("/", verifyJWT, validate(createProjectSchema), createProject);
router.get("/", verifyJWT, getAllProjects);
router.get("/:projectId", verifyJWT, validate(getProjectSchema), getProject);
router.patch(
  "/:projectId",
  verifyJWT,
  validate(updateProjectSchema),
  updateProject,
);
router.delete(
  "/:projectId",
  verifyJWT,
  validate(deleteProjectSchema),
  deleteProject,
);
router.post(
  "/:projectId/members",
  verifyJWT,
  validate(addMemberToProjectSchema),
  addMemberToProject,
);
router.delete(
  "/:projectId/members/:memberId",
  verifyJWT,
  validate(removeMemberFromProjectSchema),
  removeMemberFromProject,
);
router.get(
  "/:projectId/members",
  verifyJWT,
  validate(getProjectMembersSchema),
  getProjectMembers,
);
router.patch(
  "/:projectId/members/:memberId",
  verifyJWT,
  validate(changeProjectMemberRoleSchema),
  changeProjectMemberRole,
);

export default router;
