import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import ApiError from "../errors/ApiError";

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
