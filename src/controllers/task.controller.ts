import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createTask = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "User registered Successfully"));
});
const updateTaskById = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "User registered Successfully"));
});

const getTask = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");
  console.log("sandeep")

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "User registered Successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "User registered Successfully"));
});

const deleteTaskById = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "User registered Successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  // throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, { ok: "ok" }, "User registered Successfully"));
});

export {
  createTask,
  updateTaskById,
  deleteTaskById,
  getTaskById,
  getTask,
  deleteTask,
};
