import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../../types/user.type";
import { upload } from "../../utils/upload";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getAllUser);

router.post(
  "/register",
  // validateRequest(UserValidation.createUserValidationSchema),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  UserController.createUser
);

router.patch(
  "/update-profile",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data); // 'data' is expected to be JSON stringified
    }
    next();
  },
  auth(UserRole.USER, UserRole.ADMIN, UserRole.MECHANIC),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser
);

router.delete("/:userId", UserController.deleteUser);

export const UserRoutes = router;
