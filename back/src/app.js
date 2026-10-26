import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

import Client from "./models/Client.js";
import Admin from "./models/Admin.js";
import Product from "./models/Product.js";

import bcrypt from "bcryptjs";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

const PUERTO = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL establecida correctamente.");

    await sequelize.sync();
    console.log("Tablas sincronizadas correctamente.");

    // Crear administrador inicial

    const administradorExistente = await Admin.findOne({
    where: { email: "admin@tienda.com" }
    });

    if (!administradorExistente) {
    const contrasenaAdmin = await bcrypt.hash("admin123", 10);

    await Admin.create({
        nombre: "Administrador",
        email: "admin@tienda.com",
        password: contrasenaAdmin
    });

    console.log("Administrador inicial creado.");
    }

    // Crear administrador gestor de productos

    const gestorExistente = await Admin.findOne({
    where: { email: "gestor@tienda.com" }
    });

    if (!gestorExistente) {
    const contrasenaGestor = await bcrypt.hash("gestor123", 10);

    await Admin.create({
        nombre: "Gestor de Productos",
        email: "gestor@tienda.com",
        password: contrasenaGestor,
        role: "gestor_productos"
    });

    console.log("Administrador gestor creado.");
    }

    // Crear cliente inicial

    const clienteExistente = await Client.findOne({
    where: { email: "cliente@tienda.com" }
    });

    if (!clienteExistente) {
    const contrasenaCliente = await bcrypt.hash("cliente123", 10);

    await Client.create({
        nombre: "Cliente",
        email: "cliente@tienda.com",
        password: contrasenaCliente,
        direccion: "Direccion de prueba",
        telefono: "123456789"
    });

    console.log("Cliente inicial creado.");
    }

    app.listen(PUERTO, () => {
      console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
    
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

iniciarServidor();


