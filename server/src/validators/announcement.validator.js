import * as z from "zod";

// create announcement validation schema

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5).max(50),
    content: z.string().trim().max(1000).optional(),
    priority: z.enum(["low", "medium", "high"]),
  }),
  params: z.object({
    projectId: z.string().trim().min(1),
  }),
});

// get announcment validation schema

export const getAnnouncementSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
    announcementId: z.string().trim().min(1),
  }),
});

//--get all announcements validation schema

export const getAllAnnouncementsSchema = z.object({
  params: {
    projectId: z.string().trim().min(1),
  },
});

// -- update announcement validation schema

export const updateAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5).max(50).optional(),
    content: z.string().trim().max(1000).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
  params: z.object({
    projectId: z.string().trim().min(1),
    announcementId: z.string().trim().min(1),
  }),
});

//--- delete announcement validation schema

export const deleteAnnouncementSchema = z.object({
  params: z.object({
    projectId: z.string().trim().min(1),
    announcementId: z.string().trim().min(1),
  }),
});
