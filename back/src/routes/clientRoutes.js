import express from "express";

import {
  verifyToken,
  isClient
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/perfil", verifyToken, isClient, (req, res) => {
  res.json({
    mensaje: "Perfil del cliente",
    usuario: req.usuario
  });
});

export default router;

