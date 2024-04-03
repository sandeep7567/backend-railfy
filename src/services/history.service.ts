import { History } from "../modals/history.modal";

export const historyService = {
  getAllHistory: async (): Promise<any> => {
    return await History.find({
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } },
        { status: { $ne: "deleted" } },
      ],
    });
  },

  getHistoryById: async (id: string): Promise<any> =>
    await History.findById(id),

  getAllHistoryByTaskId: async (taskId: string): Promise<any> =>
    await History.find({ taskId }),

  getHistoryByTaskId: async (taskId: string): Promise<any> =>
    await History.findOne({ taskId }),

  updateHistoryStatusById: async (id: string, status: string): Promise<any> => {
    return await History.findByIdAndUpdate(id, { status }, { new: true });
  },

  updateHistoryStatusByTaskId: async (
    id: string,
    status: string
  ): Promise<any> => {
    return await History.updateMany({ taskId: id }, { status });
  },

  deleteAllHistory: async (): Promise<any> => await History.deleteMany(),

  deleteHistoryById: async (id: string): Promise<any> =>
    await History.findByIdAndDelete(id),

  deleteHistoryByTaskId: async (
    id: string,
    allow: boolean = false
  ): Promise<any> =>
    allow
      ? await History.deleteMany({ taskId: id })
      : await History.updateMany({ taskId: id }, { status: "deleted" }),

  // Additional service functions
  updateHistoryById: async (id: string, updateData: any): Promise<any> =>
    await History.findByIdAndUpdate(id, updateData, { new: true }),

  deleteHistoryByQuery: async (query: any): Promise<any> =>
    await History.deleteMany(query),

  getHistoryByQuery: async (query: any): Promise<any> =>
    await History.find(query),
};
