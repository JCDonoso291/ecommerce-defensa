import express from "express";
import { crearProducto, obtenerProductos, 
    obtenerProductoPorId, actualizarProducto, eliminarProducto } from "../controllers/productController.js";
import { verifyToken, isAdmin, checkAdminRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  isAdmin,
  checkAdminRole("superadmin", "gestor_productos"),
  crearProducto
);

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  checkAdminRole("superadmin", "gestor_productos"),
  actualizarProducto
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  checkAdminRole("superadmin"),
  eliminarProducto
);

export default router;

