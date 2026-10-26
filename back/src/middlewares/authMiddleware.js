import jwt from "jsonwebtoken";

// Verificar el token
export const verifyToken = (req, res, next) => {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Token no proporcionado"
    });
  }

  const token = autorizacion.split(" ")[1];

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = datos;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado"
    });
  }
};

// Permitir solamente clientes
export const isClient = (req, res, next) => {
  if (req.usuario.type !== "client") {
    return res.status(403).json({
      mensaje: "Acceso solo para clientes"
    });
  }

  next();
};

// Permitir solamente administradores
export const isAdmin = (req, res, next) => {
  if (req.usuario.type !== "admin") {
    return res.status(403).json({
      mensaje: "Acceso solo para administradores"
    });
  }

  next();
};

// Que permisos tienen los administradores

export const checkAdminRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        mensaje: "No tiene permisos para realizar esta acción"
      });
    }

    next();
  };
};


