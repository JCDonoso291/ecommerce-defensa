import express from "express";

import {
  loginClient,
  loginAdmin,
  renovarToken
} from "../controllers/authController.js";

const router = express.Router();

router.post("/client/login", loginClient);

router.post("/admin/login", loginAdmin);

router.post("/refresh", renovarToken);

export default router;

