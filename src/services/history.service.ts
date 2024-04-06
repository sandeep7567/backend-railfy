import { History } from "../modals/history.modal";

export const historyService = {
  saveHistory: async (data: any): Promise<any> => {
    const { _id, createdAt, updatedAt, ...taskHistory } = data._doc;
    const history = new History({
      taskId: _id,
      taskHistory,
    });

    return await history.save();
  },
  updateHistory: async (data: any): Promise<any> => {
    const history = new History({
      taskId: data.taskId,
      status: data.status,
      version: data.version,
      taskHistory: data.taskHistory,
    });

    return await history.save();
  },
  getAllHistory: async (): Promise<any> => {
    return await History.find({
      status: { $in: ["created", "updated"] },
    });
  },

  getHistoryById: async (id: string): Promise<any> =>
    await History.findById(id),

  getAllHistoryByTaskId: async (taskId: string): Promise<any> =>
    await History.find({ taskId }),

  getHistoryByTaskId: async (taskId: string): Promise<any> =>
    // await History.findOne({ taskId }),
    await History.findOne({ taskId }, {}, { sort: { createdAt: -1 } }).limit(1),

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

  deleteAllHistoryByTaskId: async (
    id: string,
    allow: boolean = true
  ): Promise<any> =>
    // allow
    await History.deleteMany({ taskId: id }),
  // : await History.updateMany({ taskId: id }, { status: "deleted" }),

  updateHistoryById: async (id: string, updateData: any): Promise<any> =>
    await History.findByIdAndUpdate(id, updateData, { new: true }),

  deleteHistoryByQuery: async (query: any): Promise<any> =>
    await History.deleteMany(query),

  getHistoryByQuery: async (query: any): Promise<any> =>
    await History.find(query),
};