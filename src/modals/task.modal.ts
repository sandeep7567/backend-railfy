import mongoose from "mongoose";
import { History } from "./history.modal";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    maintainceDate: {
      type: Date,
      required: true,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    days: {
      type: Number,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.post("save", async function (doc) {
  const taskId = doc._id;
  const status = doc.isNew ? "created" : "updated";

  // Create history record for the task
  await History.create({ taskId, status });
});

export const Task = mongoose.model("Task", taskSchema);
