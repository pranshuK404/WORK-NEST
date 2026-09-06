import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "in_progress", "completed"],
        message: "Invalid status",
      },
      default: "pending",
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "high"],
        message: "Invalid priority",
      },
      default: "low",
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    subtasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },

        // assignee: {   //**later on we can add this feature to assign a subtask to a user**
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "User",
        //   default: null,
        // },
        dueDate:{
          type: Date,
          default: null,
        },

        isCompleted: {
          type: Boolean,
          enum:{
            values: [true, false],
            message: "Invalid isCompleted",
          },
          default: false,
        },
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

taskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const Task = mongoose.model("Task", taskSchema);
