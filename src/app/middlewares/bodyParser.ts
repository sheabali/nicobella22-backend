import { StatusCodes } from "http-status-codes";

import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import catchAsync from "../utils/catchAsync";

export const parseBody = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.data) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Please provide data in the body under data key"
      );
    }
    req.body = JSON.parse(req.body.data);

    next();
  }
);
