import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//---import validation schemas

import {
  createAnnouncementSchema,
  getAllAnnouncementsSchema,
  getAnnouncementSchema,
  updateAnnouncementSchema,
  deleteAnnouncementSchema,
} from "../validators/announcement.validator.js";

//--import controllers

import {
  createAnnouncement,
  getAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement/0index.js";

const router = Router({ mergeParams: true });

//--mapping routes

router.post(
  "/",
  verifyJWT,
  validate(createAnnouncementSchema),
  createAnnouncement,
);
router.get(
  "/",
  verifyJWT,
  validate(getAllAnnouncementsSchema),
  getAllAnnouncements,
);
router.get(
  "/:announcementId",
  verifyJWT,
  validate(getAnnouncementSchema),
  getAnnouncement,
);
router.patch(
  "/:announcementId",
  verifyJWT,
  validate(updateAnnouncementSchema),
  updateAnnouncement,
);
router.delete(
  "/:announcementId",
  verifyJWT,
  validate(deleteAnnouncementSchema),
  deleteAnnouncement,
);

export default router;
