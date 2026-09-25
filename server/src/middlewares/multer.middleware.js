import multer from "multer";
import ApiError from "../utils/ApiError.js";
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  // Images
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",

  // Documents
  "application/pdf",
  "application/msword",
  // Text / data
  "text/plain",
  "text/csv",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadFiles = (req, res, next) => {
  upload.array("files",10)(req, res, (err) => {
    if (err) {
      return next(new ApiError(400, err.message));
    }

    next();
  });
};
