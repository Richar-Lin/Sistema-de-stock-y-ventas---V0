import { Proveedor } from "../models/Proveedor.js";

// Función para mostrar todos los proveedores
const mostrarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({
      where: { estado: 1 } // Solo obtener proveedores activos
    });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
};

// Función para mostrar un proveedor por ID
const mostrarProveedorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor || proveedor.estado === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el proveedor" });
  }
};

// Función para guardar un nuevo proveedor
const guardarProveedor = async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;

  // Almacenar en la BD
  try {
    const nuevoProveedor = await Proveedor.create({
      nombre,
      telefono: telefono || "sin teléfono", // Permitir valores null
      email: email || "sin email", // Permitir valores null
      direccion: direccion || "sin direccion", // Permitir valores null
      estado: 1 // Proveedor activo por defecto
    });

    res.json(nuevoProveedor);
  } catch (error) {
    console.error("Error al guardar el proveedor:", error);
    res.status(500).json({ mensaje: 'Error al guardar el proveedor' });
  }
};

// Función para actualizar un proveedor
const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, direccion } = req.body;

  try {
    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor || proveedor.estado === 0) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    proveedor.nombre = nombre;
    proveedor.telefono = telefono || "sin teléfono"; // Permitir valores null
    proveedor.email = email || "sin email"; // Permitir valores null
    proveedor.direccion = direccion || "sin direccion"; // Permitir valores null

    await proveedor.save();
    res.json(proveedor);
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el proveedor' });
  }
};

// Función para eliminar un proveedor (eliminación lógica)
const eliminarProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor || proveedor.estado === 0) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    proveedor.estado = 0; // Cambiar el estado a 0 para desactivar el proveedor
    await proveedor.save();
    res.json({ mensaje: 'Proveedor eliminado con éxito' });
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    res.status(500).json({ mensaje: 'Error al eliminar el proveedor' });
  }
};

export {
  guardarProveedor,
  mostrarProveedores,
  actualizarProveedor,
  mostrarProveedorPorId,
  eliminarProveedor
};