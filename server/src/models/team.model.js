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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
  },
  { timestamps: true },
);

export const Team = mongoose.model("Team", teamSchema);
