import { Request, Response } from "express";

import { historyService } from "../services/history.service";
import { taskService } from "../services/task.service";

import { TaskType } from "../types";

import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { getDueDate } from "../utils/dueDate";

import { ParamsDictionary } from "express-serve-static-core";

// Controller to create task
const createTask = asyncHandler(
  async (req: Request<{}, {}, TaskType>, res: Response) => {
    const { title, description, maintainceDate, days } = req.body;

    // Validate request body
    if (
      !title ||
      typeof title !== "string" ||
      !maintainceDate ||
      !days ||
      typeof days !== "number"
    ) {
      throw new ApiError(400, "Please fill up the required details");
    }

    // 60 days in milliseconds
    const dueDate = getDueDate(maintainceDate, days).toString();

    const taskData: TaskType = {
      ...req.body,
      dueDate,
    };

    // Save task
    const task = await taskService.saveTask(taskData);

    // Verify if task was created
    if (!task) {
      throw new ApiError(404, "Not Found");
    }

    const history = await historyService.saveHistory(task);

    if (!history) {
      throw new ApiError(404, "Not Found");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, { task }, "Task created Successfully"));
  }
);

// Controller to get All tasks
const getAllTasks = asyncHandler(
  async (
    req: Request<ParamsDictionary, any, any, any, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) => {
    const pageIndex: number = req.query.pageIndex
      ? parseInt(req.query.pageIndex)
      : 0;
    const pageSize: number = req.query.pageSize
      ? parseInt(req.query.pageSize)
      : 6;

    const order: string = req.query.field === "dueDate" ? req.query.order : "";

    const sort: 1 | -1 = order === "asc" ? 1 : -1;

    const tasks: any = await taskService.getAllTasks(sort, pageIndex, pageSize);

    const [{ data, totalDocuments }] = tasks;

    const paginatedTasks = data.map((task: any) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      days: task.days,
      dueDate: task.dueDate,
      maintainceDate: task.maintainceDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    // const paginatedData = data;
    const totalDoc = totalDocuments[0]?.total || 0;

    // Calculate total number of pages
    const totalPages = Math.ceil(totalDoc / pageSize);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          taskInfo: paginatedTasks,
          pageInfo: { totalDoc, totalPages, currentPage: pageIndex + 1 },
        },
        "Tasks fetched Successfully"
      )
    );
  }
);

// Controller to get task by id
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "Not found ID");
  }

  const task = await taskService.getTaskById(id.toString());

  return res
    .status(201)
    .json(new ApiResponse(200, task, "User registered Successfully"));
});

// Controller to update task by id
const updateTaskById = asyncHandler(
  async (req: Request<any, any, TaskType>, res: Response) => {
    // throw new ApiError(500, "Something went wrong while registering the user");
    const { maintainceDate, days } = req.body;
    const dueDate = getDueDate(maintainceDate, days).toString();

    const taskData: TaskType = {
      ...req.body,
      dueDate,
    };

    // Update task data
    const updatedTask = await taskService.updateTaskById(
      req.params.id,
      taskData
    );

    // Verify if task was updated
    if (!updatedTask) {
      throw new ApiError(404, "Task not found");
    }

    const existingHistory = await historyService.getHistoryByTaskId(
      updatedTask._id
    );

    if (!existingHistory) {
      const newHistory = await historyService.saveHistory(updatedTask);

      const { taskId, version, status, taskHistory, ...restData } = newHistory?._doc

      const createHistory = await historyService.updateHistory({ taskId, version, status, taskHistory });

      if (!createHistory) {
        throw new ApiError(404, "Not Found");
      }

      return res
        .status(201)
        .json(
          new ApiResponse(201, updatedTask, "Task updated by id Successfully")
        );
    };

    // Update history
    const { _id, createdAt, updatedAt, ...history } = updatedTask;

    const updateHistoryFormated = {
      taskId: _id,
      taskHistory: history,
      version: existingHistory.version,
      status:  existingHistory.status,
    };

    const updateHistory = await historyService.updateHistory(updateHistoryFormated);

    if (!updateHistory) {
      throw new ApiError(404, "Not Found");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, updatedTask, "Task updated by id Successfully")
      );
  }
);

// Controller to delete all tasks
const deleteAllTasks = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");
  const [deleteTask, deleteHistory] = await Promise.all([
    await taskService.deleteAllTasks(),
    await historyService.deleteAllHistory(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deleteHistory, deleteTask },
        "Delete All Tasks Successfully"
      )
    );
});

// Controller to delete task by id
const deleteTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteHistory = req.query.deleteHistory === "false";

  if (!id) {
    throw new ApiError(400, "Please fill up the required details");
  }

  const task = await taskService.deleteTaskById(id.toString());

  // verfify task have or not ?
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const historyDelete = await historyService.deleteAllHistoryByTaskId(
    id.toString(),
    deleteHistory
  );

  if (!historyDelete) {
    throw new ApiError(500, "Failed to delete history");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted Successfully"));
});

export {
  createTask,
  deleteAllTasks,
  deleteTaskById,
  getAllTasks,
  getTaskById,
  updateTaskById,
};
