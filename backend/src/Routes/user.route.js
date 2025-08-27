import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.get("/login", login);
router.post("/logout", logout);
router.patch("/profile/update", isAuthenticated, updateProfile);

export default router;
