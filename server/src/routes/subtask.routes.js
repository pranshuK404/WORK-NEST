import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//  importing subtask validation schema

import {
  createSubtaskSchema,
  getAllSubtasksSchema,
  deleteSubtaskSchema,
  editSubtaskSchema,
  toggleCompleteSchema,
} from "../validators/subtask.validator.js";

//---Importing subtask controllers
import {
  createSubtask,
  getAllSubtasks,
  deleteSubtask,
  editSubtask,
  toggleComplete,
} from "../controllers/subtasks/0index.js";

const router = Router({ mergeParams: true });

// --mapping subtask routes
router.post(
  "/",
  verifyJWT,
  validate(createSubtaskSchema),
  createSubtask,
);
router.get(
  "/",
  verifyJWT,
  validate(getAllSubtasksSchema),
  getAllSubtasks,
);
router.delete(
  "/:subtaskId",
  verifyJWT,
  validate(deleteSubtaskSchema),
  deleteSubtask,
);
router.patch(
  "/:subtaskId",
  verifyJWT,
  validate(editSubtaskSchema),
  editSubtask,
);
router.patch(
  "/:subtaskId/complete",
  verifyJWT,
  validate(toggleCompleteSchema),
  toggleComplete,
);

export default router;
