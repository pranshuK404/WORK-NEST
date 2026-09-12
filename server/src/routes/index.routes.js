import { Router } from "express";

//--IMPORTING ROUTES--
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import teamRoutes from "./team.routes.js";
import subtaskRoutes from "./subtask.routes.js";

//--MOUNTING ROUTES--
const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/projects/:projectId/tasks", taskRoutes);
router.use("/projects/:projectId/teams", teamRoutes);
router.use("/projects/:projectId/tasks/:taskId/subtasks", subtaskRoutes);

export default router;
