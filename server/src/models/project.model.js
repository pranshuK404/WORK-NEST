import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim :true
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "manager", "member"],
          default: "member",
        },
      },
    ],
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
