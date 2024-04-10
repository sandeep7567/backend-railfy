import { taskService } from "../services/task.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { historyService } from "./../services/history.service";

import { Request, Response } from "express";

// Function to fetch all history records by taskId
export const getAllHistoryByTaskId = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  const {
    field = "createdAt",
    order = "asc",
    pageIndex = 0,
    pageSize = 10,
  } = req.query;
  const sort = field === "createdAt" && order === "asc" ? -1 : 1;

  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const historyByTaskId = await historyService.getAllHistoryByTaskId(
    sort,
    Number(pageIndex),
    Number(pageSize),
    field?.toString(),
    taskId
  );

  const [
    {
      data: history,
      totalDocuments,
    },
  ] = historyByTaskId;

  const totalDoc = !!totalDocuments.length ? totalDocuments[0].total : totalDocuments.length;


  const pagination = {
    totalDoc,
    totalPages: Math.ceil(totalDoc / Number(pageSize)),
    currentPage: Number(pageIndex) + 1,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { history, pagination },
        "History of task fetched Successfully"
      )
    );
};

// Function to fetch a specific history record by historyId
export const getHistoryByHistoryId = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const historyId = req.params.historyId;
  if (!historyId || !taskId) {
    return res.status(400).json({ error: "historyId is required" });
  }

  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (taskId !== task?._id) {
    throw new ApiError(404, "Task not found");
  }

  const history = await historyService.getHistoryById(historyId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, history, "History of task fetched Successfully")
    );
};

export const deleteAllHistoryByTaskId = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  };
  
  if (taskId !== task?._id.toString()) {
    throw new ApiError(404, "Task not found");
  };

  await historyService.deleteAllHistoryByTaskId(taskId);

  res
    .status(200)
    .json({ message: `Delete all history records for taskId ${taskId}` });
};

// Function to delete a specific history record by historyId
export const deleteHistoryByHistoryId = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const historyId = req.params.historyId;
  if (!historyId || !taskId) {
    return res.status(400).json({ error: "historyId is required" });
  }

  const task = await taskService.getTaskById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  };

  if (taskId !== task?._id.toString()) {
    throw new ApiError(404, "Task not found");
  };

  const deletedHistory = await historyService.deleteHistoryById(historyId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Deleted history record ${deletedHistory._id} for taskId ${taskId}`
      )
    );
};