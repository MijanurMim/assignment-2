import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin"), userControllers.getUser);

router.put("/:id", auth("admin", "customer"), userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;
