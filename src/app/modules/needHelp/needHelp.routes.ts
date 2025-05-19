import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { NeedHelpController } from "./needHelp.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  NeedHelpController.getAllNeedHelpController
);

router.post("/", NeedHelpController.createNeedHelpController);
router.get("/:helpId", NeedHelpController.getSingleHelp);

export const NeedHelpRoutes = router;
