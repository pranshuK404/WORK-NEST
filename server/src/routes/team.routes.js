import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//--importing team Validation Schema
import {
  createTeamSchema,
  getAllTeamsSchema,
  getTeamSchema,
  addMemberSchema,
  removeMemberSchema,
  deleteTeamSchema,
  setTeamLeadSchema,
} from "../validators/team.validator.js";

//--importing team controllers
import {
  createTeam,
  getAllTeams,
  getTeam,
  addMember,
  removeMember,
  deleteTeam,
  setTeamLead,
} from "../controllers/team/0index.js";

const router = Router({ mergeParams: true });

// -- mapping team routes

router.post(
  "/",
  verifyJWT,
  validate(createTeamSchema),
  createTeam,
);
router.get(
  "/",
  verifyJWT,
  validate(getAllTeamsSchema),
  getAllTeams,
);
router.get(
  "/:teamId",
  verifyJWT,
  validate(getTeamSchema),
  getTeam,
);
router.delete(
  "/:teamId",
  verifyJWT,
  validate(deleteTeamSchema),
  deleteTeam,
);
router.post(
  "/:teamId/members",
  verifyJWT,
  validate(addMemberSchema),
  addMember,
);
router.delete(
  "/:teamId/members/:memberId",
  verifyJWT,
  validate(removeMemberSchema),
  removeMember,
);
router.patch(
  "/:teamId/members/:memberId/lead",
  verifyJWT,
  validate(setTeamLeadSchema),
  setTeamLead,
);

export default router;
