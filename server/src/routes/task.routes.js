import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//---Importing task Validation Schema
import {
  createTaskSchema,
  getAllTasksSchema,
  getTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  assignTeamToTaskSchema,
  changeTaskStatusSchema,
} from "../validators/tasks.validator.js";

//---Importing task controllers
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  assignTeamToTask,
  changeTaskStatus,
} from "../controllers/tasks/0index.js";

const router = Router({ mergeParams: true });

//--mapping task routes
router.post(
  "/",
  verifyJWT,
  validate(createTaskSchema),
  createTask,
);
router.get(
  "/",
  verifyJWT,
  validate(getAllTasksSchema),
  getAllTasks,
);
router.get(
  "/:taskId",
  verifyJWT,
  validate(getTaskSchema),
  getTask,
);
router.patch(
  "/:taskId",
  verifyJWT,
  validate(updateTaskSchema),
  updateTask,
);
router.patch(
  "/:taskId/status/:teamId",
  verifyJWT,
  validate(changeTaskStatusSchema),
  changeTaskStatus,
);
router.delete(
  "/:taskId",
  verifyJWT,
  validate(deleteTaskSchema),
  deleteTask,
);
router.post(
  "/:taskId/assign/:teamId",
  verifyJWT,
  validate(assignTeamToTaskSchema),
  assignTeamToTask,
);

export default router;
