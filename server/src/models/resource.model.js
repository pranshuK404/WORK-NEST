import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["file", "link"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Used when type === "link"
    url: {
      type: String,
      trim: true,
    },

    // Used when type === "file"
    originalName: {
      type: String,
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
    },

    size: {
      type: Number,
    },

    cloudinaryUrl: {
      type: String,
      trim: true,
    },

    cloudinaryPublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Resource = mongoose.model("Resource", resourceSchema);
