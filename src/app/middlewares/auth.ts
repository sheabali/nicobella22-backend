import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";

import ApiError from "../errors/ApiError";
import { UserRole } from "../types/user.type";
import prisma from "../utils/prisma";

const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    try {
      const decoded = jwt.verify(
        token,
        // config.jwt_access_secre as string
        config.jwtAccessSecret as string
      ) as JwtPayload;

      const { role, email, id } = decoded;

      const user = await prisma.user.findMany({
        where: { id, email, role, isActive: true },
      });

      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "This user is not found!");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }

      req.user = decoded as JwtPayload & { role: string };
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Token has expired! Please login again."
          )
        );
      }
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token!"));
    }
  });
};

export default auth;
