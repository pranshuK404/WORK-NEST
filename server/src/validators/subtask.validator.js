import * as z from "zod";

//---create subtask validation schema
export const createSubtaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(50),
    dueDate: z.date().optional(),
  }),
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

// ---get all subtask validation schema

export const getAllSubtasksSchema = z.object({
  params: z.object({
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//--delete subtask validation schema
export const deleteSubtaskSchema = z.object({
  params: z.object({
    subtaskId: z.string().trim().min(1),
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//---edit subtask validation schema
export const editSubtaskSchema = z.object({
  body: z.object({
    title: z.string().optional().trim().min(3).max(50),
    dueDate: z.date().optional(),
  }),
  params: z.object({
    subtaskId: z.string().trim().min(1),
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//---toggle complete vaidation schema

export const toggleCompleteSchema = z.object({
  params: z.object({
    subtaskId: z.string().trim().min(1),
    taskId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});
