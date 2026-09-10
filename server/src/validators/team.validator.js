import * as z from "zod";

//--Create team validation schema
export const createTeamSchema = z.object({
  body: z.object({
    teamName: z.string().trim().min(3).max(50),
  }),
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

//--delete team validation schema
export const deleteTeamSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//--get team validation schema
export const getTeamSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
});

//--add member validation schema
export const addMemberSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
  }),
  body: z.object({
    role: z.string().trim().enum(["manager", "member"]),
    email: z.email().trim(),
  }),
});

// --remove member validation schema
export const removeMemberSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
  }),
});

//---set team lead validation schema
export const setTeamLeadSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
  }),
});

//--- get all teams validation schema

export const getAllTeams = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});
