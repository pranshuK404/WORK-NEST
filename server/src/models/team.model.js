import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    teamName: {
      type: string,
      required: true,
    },
    teamMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["member", "lead"],
          default: "member",
        },
      },
    ],
  },
  { timestamps: true },
);

export const Team = mongoose.model("Team", teamSchema);
