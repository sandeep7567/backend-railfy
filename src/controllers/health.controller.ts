import { Response, Request } from "express";

export const getHealthStatus = (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
};