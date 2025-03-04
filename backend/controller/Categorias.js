import { Categoria } from "../models/Categoria.js";

// Función para mostrar todos los categorias
const mostrarCategoria = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: { estado: 1 } // Solo obtener categorias activos
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorias" });
  }
};

// Función para mostrar un categoria por ID
const mostrarCategoriaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria || categoria.estado === 0) {
      return res.status(404).json({ message: "Categoria no encontrado" });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la categoria" });
  }
};

// Función para guardar una nueva categoria
const guardarCategoria = async (req, res) => {
  const { nombre } = req.body;

  // Almacenar en la BD
  try {
    const nuevaCategoria = await Categoria.create({
      nombre,
    });

    res.json(nuevaCategoria);
  } catch (error) {
    console.error("Error al guardar la categoria:", error);
    res.status(500).json({ mensaje: 'Error al guardar la categoria' });
  }
};

// Función para actualizar un categoria
const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre} = req.body;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria || categoria.estado === 0) {
      return res.status(404).json({ mensaje: 'Categoria no encontrado' });
    }

    categoria.nombre = nombre;

    await categoria.save();
    res.json(categoria);
  } catch (error) {
    console.error("Error al actualizar la categoria:", error);
    res.status(500).json({ mensaje: 'Error al actualizar la categoria' });
  }
};

// Función para eliminar un categoria (eliminación lógica)
const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria || categoria.estado === 0) {
      return res.status(404).json({ mensaje: 'Categoria no encontrado' });
    }

    categoria.estado = 0; // Cambiar el estado a 0 para desactivar el categoria
    await categoria.save();
    res.json({ mensaje: 'Categoria eliminado con éxito' });
  } catch (error) {
    console.error("Error al eliminar el Categoria:", error);
    res.status(500).json({ mensaje: 'Error al eliminar el Categoria' });
  }
};

export {
  guardarCategoria,
  mostrarCategoria,
  actualizarCategoria,
  mostrarCategoriaPorId,
  eliminarCategoria
};