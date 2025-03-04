import express from "express";
import { guardarCategoria, mostrarCategoria, mostrarCategoriaPorId, actualizarCategoria, eliminarCategoria } from "../controller/Categorias.js";

const router = express.Router();

// Ruta para guardar un nuevo Categoria
router.post('/', guardarCategoria);

// Ruta para mostrar todos los Categoria
router.get('/', mostrarCategoria);

// Ruta para mostrar un Categoria por ID
router.get('/:id', mostrarCategoriaPorId);

// Ruta para actualizar un Categoria
router.put('/:id', actualizarCategoria);

// Ruta para eliminar un Categoria (eliminación lógica)
router.delete('/:id', eliminarCategoria);

export default router;