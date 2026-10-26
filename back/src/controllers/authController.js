import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Client from "../models/Client.js";
import Admin from "../models/Admin.js";

// Inicio de sesión del cliente
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cliente = await Client.findOne({
      where: { email }
    });

    if (!cliente) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const contrasenaCorrecta = await bcrypt.compare(
      password,
      cliente.password
    );

    if (!contrasenaCorrecta) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      { id: cliente.id, type: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: cliente.id,
        type: "client"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
    mensaje: "Inicio de sesión correcto",
    token,
    refreshToken
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Inicio de sesión del administrador
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const administrador = await Admin.findOne({
      where: { email }
    });

    if (!administrador) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const contrasenaCorrecta = await bcrypt.compare(
      password,
      administrador.password
    );

    if (!contrasenaCorrecta) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      { id: administrador.id, 
        type: "admin",
        role: administrador.role
     },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: administrador.id,
        type: "admin",
        role: administrador.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
    mensaje: "Inicio de sesión correcto",
    token,
    refreshToken,
    role: administrador.role
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Renovar el token de acceso
  export const renovarToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      mensaje: "Token de renovación no proporcionado"
    });
  }

  try {
    const datos = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const nuevoToken = jwt.sign(
      {
        id: datos.id,
        type: datos.type,
        ...(datos.type === "admin" ? { role: datos.role } : {})
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: nuevoToken });

  } catch (error) {
    res.status(401).json({
      mensaje: "Token de renovación inválido o expirado"
    });
  }
};