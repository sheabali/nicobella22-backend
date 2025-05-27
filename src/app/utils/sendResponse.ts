import { Response } from "express";

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T | null | undefined;
  meta?: Meta; // Optional, for pagination or additional metadata
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.message,
    message: data.message,
    data: data.data || null || undefined, // Ensure data is never undefined
    meta: data.meta, // Optional, for pagination or additional metadata
  });
};

export default sendResponse;
