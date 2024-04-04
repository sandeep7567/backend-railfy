import { Request, Response } from "express";
import { Task } from "../modals/task.modal";

import { historyService } from "../services/history.service";
import { taskService } from "../services/task.service";

import { TaskType } from "../types";

import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { getDueDate } from "../utils/dueDate";

import { ParsedQs } from "qs";

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
const getAllTasks = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");
  const tasks: any[] = await taskService.getAllTasks();

  return res
    .status(201)
    .json(new ApiResponse(200, tasks, "Tasks fetched Successfully"));
});

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
    const task = await taskService.updateTaskById(req.params.id, taskData);

    // Verify if task was updated
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const history = await historyService.saveHistory(task);

    if (!history) {
      throw new ApiError(404, "Not Found");
    };

    return res
      .status(201)
      .json(new ApiResponse(200, task, "Task updated by id Successfully"));
  }
);

// Controller to delete all tasks
const deleteAllTasks = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");
  await taskService.deleteAllTasks();

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "Delete All Tasks Successfully"));
});

// Controller to delete task by id
const deleteTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteHistory = req.query.deleteHistory === "true";

  if (!id) {
    throw new ApiError(400, "Please fill up the required details");
  }

  const task = await taskService.deleteTaskById(id.toString());

  // verfify task have or not ?
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const historyDelete = await historyService.deleteHistoryByTaskId(
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
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteAllTasks,
  deleteTaskById,
};
