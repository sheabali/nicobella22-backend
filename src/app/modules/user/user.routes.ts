import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
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
  "/:userId",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser
);

router.delete("/:userId", UserController.deleteUser);

export const UserRoutes = router;
