import Product from "../models/Product.js";
import { Op } from "sequelize";

// Crear un producto
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock } = req.body;

    const producto = await Product.create({
      nombre,
      descripcion,
      precio,
      categoria,
      stock
    });

    res.status(201).json(producto);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};


// Obtener todos los productos

export const obtenerProductos = async (req, res) => {
  try {
    const { buscar, categoria, orden, pagina = 1, limite = 5 } = req.query;
    const offset = (Number(pagina) - 1) * Number(limite);

    const condicion = {};

    if (buscar) {
      condicion.nombre = {
        [Op.like]: `%${buscar}%`
      };
    }
    
    if (categoria) {
    condicion.categoria = categoria;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: condicion,
      order: [["precio", orden === "DESC" ? "DESC" : "ASC"]],
      limit: Number(limite),
      offset: offset
    });

    res.json({
        totalProductos: count,
        paginaActual: Number(pagina),
        totalPaginas: Math.ceil(count / Number(limite)),
        productos: rows
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};



// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json(producto);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};


 // Actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    const { nombre, descripcion, precio, categoria, stock } = req.body;

    await producto.update({
      nombre,
      descripcion,
      precio,
      categoria,
      stock
    });

    res.json(producto);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};
 // Eliminar un producto
    export const eliminarProducto = async (req, res) => {
    try {
    const producto = await Product.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    await producto.destroy();

    res.json({
      mensaje: "Producto eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

