import { PipelineStage } from "mongoose";
import { TaskType } from "../types";
import { Task } from "../modals/task.modal";

export const taskService = {
  saveTask: async (data: TaskType): Promise<any> => {
    const task = new Task(data);

    return await task.save();
  },

  // Service to get all tasks and also add here page, skip, limit, sort and other filter options
  getAllTasks: async (sort: 1 | -1 = -1, pageIndex: number = 0, pageSize: number = 6 ): Promise<any[]> => {
    const pipeline:PipelineStage[] = [];
    
    // // 05) Limit stage;
    const limit = pageSize ? pageSize : 6;

    // // 06) skip;
    const skip = pageIndex && pageSize ? pageIndex * pageSize : 0;

    // 07) Add pagination
    pipeline.push({
      $facet: {
        data: [ { $match: {  } }, { $sort: { dueDate: sort } }, { $skip: skip }, { $limit: limit }],
        totalDocuments: [{ $count: "total" }],
      },
    });

    return await Task.aggregate(pipeline);
  },

  // Service to get a task by ID
  getTaskById: async (id: string): Promise<any> => await Task.findById(id),

  // Service to update all tasks
  updateAllTasks: async (data: any): Promise<any> =>
    await Task.updateMany({}, data),

  updateTaskById: async (id: string, data: TaskType): Promise<any> =>
    await Task.findByIdAndUpdate(id, data, { new: true }),

  // Service to delete all tasks
  deleteAllTasks: async () => await Task.deleteMany(),

  // Service to delete a task by ID
  deleteTaskById: async (id: string): Promise<any> =>
    await Task.findByIdAndDelete(id),
};
