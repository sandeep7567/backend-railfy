import { Task } from "../modals/task.modal";
import { TaskType } from "../types";

export const taskService = {
  saveTask: async (data: TaskType): Promise<any> => {
    const task = new Task(data);

    return await task.save();
  },

  // Service to get all tasks and also add here page, skip, limit, sort and other filter options
  getAllTasks: async (): Promise<any[]> => {
    const tasks = await Task.find();

    return tasks;
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
