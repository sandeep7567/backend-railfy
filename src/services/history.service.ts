import mongoose from "mongoose";
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
    const { taskId, version, status, taskHistory, ...restData } = data._doc;
    const history = new History({
      taskId,
      status: "updated",
      version: version ? data.version + 1 : 1,
      taskHistory,
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

  // Service to get all tasks and also add here page, skip, limit, sort and other filter options
  getAllHistoryByTaskId: async (
    sort: 1 | -1 = -1,
    pageIndex: number = 0,
    pageSize: number = 6,
    field: string = "taskId",
    taskId: string
  ): Promise<any[]> => {
    const pipeline: any[] = [];

    // Limit stage
    const limit = pageSize;

    // Skip stage
    const skip = pageIndex * pageSize;

    // Check if taskId is a valid ObjectId
    const mongoDBObjectId = mongoose.isValidObjectId(taskId);
    if (!mongoDBObjectId) {
      throw new Error("Invalid taskId");
    }

    if (mongoDBObjectId) {
      pipeline.push({
        $match: { taskId: new mongoose.Types.ObjectId(taskId) },
      });
    } else {
      throw new Error("Invalid taskId");
    }
    // We can also sort by version of histroy ?
    // Add pagination
    pipeline.push({
      $facet: {
        data: [
          { $sort: { [field]: sort } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalDocuments: [
          { $match: { taskId: new mongoose.Types.ObjectId(taskId) } },
          { $count: "total" },
        ],
      },
    });

    return await History.aggregate(pipeline);
  },

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
    await History.findByIdAndDelete(id, { new: true }),

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
