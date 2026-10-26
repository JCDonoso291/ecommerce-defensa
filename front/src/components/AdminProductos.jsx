import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function AdminProductos() {
  const { adminToken, role } = useContext(AuthContext);

  const puedeEditar = ["superadmin", "gestor_productos"].includes(role);
  const puedeEliminar = role === "superadmin";

  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("ASC");

  const [idEditar, setIdEditar] = useState(null);

  const formularioVacio = {
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: ""
  };

  const [formulario, setFormulario] = useState(formularioVacio);

  // Obtener productos
  const obtenerProductos = async (paginaActual = pagina) => {
    try {
      const respuesta = await api.get("/products", {
        params: {
          pagina: paginaActual,
          limite: 5,
          buscar,
          categoria,
          orden
        }
      });

      setProductos(respuesta.data.productos);
      setTotalPaginas(respuesta.data.totalPaginas);

    } catch (error) {
      setMensaje("Error al obtener los productos");
    }
  };

  // Cargar productos al entrar o cambiar de página
  useEffect(() => {
    obtenerProductos();
  }, [pagina]);

  // Cambiar los campos del formulario
  const cambiarCampo = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // Guardar o modificar producto
  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      const configuracion = {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      };

      if (idEditar) {
        await api.put(
          `/products/${idEditar}`,
          formulario,
          configuracion
        );

        setMensaje("Producto modificado correctamente");

      } else {
        await api.post(
          "/products",
          formulario,
          configuracion
        );

        setMensaje("Producto guardado correctamente");
      }

      setFormulario(formularioVacio);
      setIdEditar(null);

      if (pagina === 1) {
        obtenerProductos(1);
      } else {
        setPagina(1);
      }

    } catch (error) {
      setMensaje("Error al guardar el producto");
    }
  };

  // Seleccionar producto para modificar
  const editarProducto = (producto) => {
    setIdEditar(producto.id);

    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      categoria: producto.categoria,
      stock: producto.stock
    });

    setMensaje("");
    window.scrollTo(0, 0);
  };

  // Cancelar modificación
  const cancelarEdicion = () => {
    setIdEditar(null);
    setFormulario(formularioVacio);
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      setMensaje("Producto eliminado correctamente");

      // Actualizar el listado
      if (productos.length === 1 && pagina > 1) {
        setPagina(pagina - 1);
      } else {
        obtenerProductos();
      }

    } catch (error) {
      setMensaje("Error al eliminar el producto");
    }
  };

  // Buscar, filtrar y ordenar
  const buscarProductos = () => {
    if (pagina === 1) {
      obtenerProductos(1);
    } else {
      setPagina(1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      <h2 className="text-xl font-bold mb-4">
        Administración de productos
      </h2>

      {/* Formulario */}
      {puedeEditar && (
        <>
          <h3 className="font-bold mb-3">
            {idEditar ? "Modificar producto" : "Nuevo producto"}
          </h3>

          <form
            onSubmit={guardarProducto}
            className="flex flex-col gap-3 mb-6"
          >
            <input
              name="nombre"
              placeholder="Nombre"
              value={formulario.nombre}
              onChange={cambiarCampo}
              required
              className="border rounded p-2"
            />

            <input
              name="descripcion"
              placeholder="Descripción"
              value={formulario.descripcion}
              onChange={cambiarCampo}
              className="border rounded p-2"
            />

            <input
              name="precio"
              type="number"
              min="0"
              placeholder="Precio"
              value={formulario.precio}
              onChange={cambiarCampo}
              required
              className="border rounded p-2"
            />

            <input
              name="categoria"
              placeholder="Categoría"
              value={formulario.categoria}
              onChange={cambiarCampo}
              required
              className="border rounded p-2"
            />

            <input
              name="stock"
              type="number"
              min="0"
              placeholder="Stock"
              value={formulario.stock}
              onChange={cambiarCampo}
              required
              className="border rounded p-2"
            />

            <button
              type="submit"
              className="border rounded p-2"
            >
              {idEditar ? "Guardar cambios" : "Guardar producto"}
            </button>

            {idEditar && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="border rounded p-2"
              >
                Cancelar
              </button>
            )}
          </form>
        </>
      )}

      {mensaje && <p className="mb-4">{mensaje}</p>}

      <h3 className="font-bold mb-3">
        Listado de productos
      </h3>

      {/* Búsqueda, categoría y orden */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">

        <input
          type="text"
          placeholder="Buscar producto"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") buscarProductos();
          }}
          className="border rounded p-2 flex-1 min-w-0"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todas</option>
          <option value="Tecnologia">Tecnología</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="border rounded p-2"
        >
          <option value="ASC">Menor precio</option>
          <option value="DESC">Mayor precio</option>
        </select>

        <button
          onClick={buscarProductos}
          className="border rounded p-2"
        >
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Stock</th>
              {(puedeEditar || puedeEliminar) && (
                <th className="border p-2">Acciones</th>
              )}
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="border p-2">
                  {producto.nombre}
                </td>

                <td className="border p-2">
                  {producto.precio}
                </td>

                <td className="border p-2">
                  {producto.categoria}
                </td>

                <td className="border p-2">
                  {producto.stock}
                </td>

                {(puedeEditar || puedeEliminar) && (
                  <td className="border p-2">
                    <div className="flex gap-2">
                      {puedeEditar && (
                        <button
                          onClick={() => editarProducto(producto)}
                          className="border rounded p-1"
                        >
                          Editar
                        </button>
                      )}

                      {puedeEliminar && (
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="border rounded p-1"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {productos.length === 0 && (
          <p className="mt-3">No se encontraron productos.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina === 1}
          className="border rounded p-2 disabled:opacity-40"
        >
          Anterior
        </button>

        <p>
          Página {pagina} de {totalPaginas}
        </p>

        <button
          onClick={() => setPagina(pagina + 1)}
          disabled={pagina >= totalPaginas}
          className="border rounded p-2 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}

export default AdminProductos;

