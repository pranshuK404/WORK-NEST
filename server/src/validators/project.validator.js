import * as z from "zod";

//--Create project validation schema
export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().max(500),
  }),
});

//--Update project validation schema

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().max(500).optional(),
  }),
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//---get project validation schema
export const getProjectSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//---delete project validation schema

export const deleteProjectSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//  add member to project validation schema

export const addMemberToProjectSchema = z.object({
  body: z.object({
    email: z.email().trim(),
  }),
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//   remove member from project validation schema

export const removeMemberFromProjectSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
  }),
});

//   get project members validation schema

export const getProjectMembersSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//  change project member role validation schema

export const changeProjectMemberRoleSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
  }),
  body: z.object({
    role: z.enum(["manager", "member"]),
  }),
});
