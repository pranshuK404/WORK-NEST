import * as z from "zod";

//---create task validation schema

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().max(500),
    dueDate: z.date().optional(),
    priority: z.string().trim().enum(["low", "high"]).optional(),
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
    title: z.string().trim().optional().min(3).max(50),
    description: z.string().trim().optional().max(500),
    dueDate: z.date().optional(),
    priority: z.string().trim().enum(["low", "high"]).optional(),
  }),
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
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
