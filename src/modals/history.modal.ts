import mongoose from "mongoose";

enum TaskStatus {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
}

interface TaskHistory {
  title: string;
  description: string;
  maintainceDate: Date;
  dueDate: Date;
  days: number;
}

// Define TaskVersionSchema
interface HistorySchemaType extends mongoose.Document {
  taskId: mongoose.Types.ObjectId;
  version: number;
  taskHistory: TaskHistory;
  status: TaskStatus;
}

const historySchema = new mongoose.Schema<HistorySchemaType>(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true,
      default: Object.values(TaskStatus)[0],
    },
    taskHistory: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: String,
      maintainceDate: {
        type: Date,
        required: true,
      },
      dueDate: Date,
      days: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const History = mongoose.model<HistorySchemaType>(
  "History",
  historySchema
);
