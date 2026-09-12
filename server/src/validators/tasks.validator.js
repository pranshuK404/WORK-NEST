import * as z from "zod";

//---create task validation schema

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().max(500),
    dueDate: z.date().optional(),
    priority: z.enum(["low", "high"]).optional(),
  }),
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//--get task validation schema

export const getTaskSchema = z.object({
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//---get all tasks validation schema

export const getAllTasksSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//--update task validation schema

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().max(500).optional(),
    dueDate: z.date().optional(),
    priority: z.enum(["low", "high"]).optional(),
  }),
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//---change task status validation schema

export const changeTaskStatusSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1),
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
  body: z.object({
    status: z.enum(["pending", "in_progress", "completed"]),
  }),
});

//---delete task validation schema

export const deleteTaskSchema = z.object({
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//-- assign team to task validation schema

export const assignTeamToTaskSchema = z.object({
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
    teamId: z.string().trim().min(1),
  }),
});
