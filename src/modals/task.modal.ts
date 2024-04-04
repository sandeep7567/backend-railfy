import mongoose from "mongoose";

// Define TaskSchema
interface TaskSchemaType extends mongoose.Document {
  title: string;
  description: string;
  maintainceDate: Date;
  dueDate: Date;
  days: number;
}

const taskSchema = new mongoose.Schema<TaskSchemaType>(
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
    },
    dueDate: {
      type: Date,
      default: null,
    },
    days: {
      type: Number,
      required: true,
      default: null,
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model<TaskSchemaType>("Task", taskSchema);