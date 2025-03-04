import express from "express";
import { guardarProveedor, mostrarProveedores, mostrarProveedorPorId, actualizarProveedor, eliminarProveedor } from "../controller/Proveedores.js";


const router = express.Router();

// Ruta para guardar un nuevo Proveedor
router.post('/', guardarProveedor);

// Ruta para mostrar todos los Proveedor
router.get('/', mostrarProveedores);

// Ruta para mostrar un Proveedor por ID
router.get('/:id', mostrarProveedorPorId);

// Ruta para actualizar un Proveedor
router.put('/:id', actualizarProveedor);

// Ruta para eliminar un Proveedor (eliminación lógica)
router.delete('/:id', eliminarProveedor);

export default router;