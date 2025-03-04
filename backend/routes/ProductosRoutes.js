import express from 'express';
import { guardarProducto, actualizarProducto, eliminarProducto, mostrarPrdocutos, mostrarProductoPorId } from "../controller/Productos.js"

const router = express.Router();


// Ruta para guardar un nuevo producto
router.post('/', guardarProducto);

// Ruta para mostrar todos los producto
router.get('/', mostrarPrdocutos);

// Ruta para mostrar un producto por ID
router.get('/:id', mostrarProductoPorId);

// Ruta para actualizar un producto
router.put('/:id', actualizarProducto);

// Ruta para eliminar un producto (eliminación lógica)
router.delete('/:id', eliminarProducto);

export default router;