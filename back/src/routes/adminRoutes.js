import express from "express";

import {
  verifyToken,
  isAdmin,
  checkAdminRole
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/metricas",
  verifyToken,
  isAdmin,
  checkAdminRole("superadmin", "auditor"),
  (req, res) => {
    res.json({
      mensaje: "Métricas administrativas",
      clientes: 1,
      productos: 0,
      ventas: 0
    });
  }
);

export default router;
