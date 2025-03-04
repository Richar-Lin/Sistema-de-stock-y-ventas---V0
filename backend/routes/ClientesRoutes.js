import express from "express";
import { guardarCliente, mostrarClientes, mostrarClientesPorId, actualizarCliente, eliminarCliente } from "../controller/Clientes.js";

const router = express.Router();

// Ruta para guardar un nuevo Cliente
router.post('/', guardarCliente);

// Ruta para mostrar todos los Clientes
router.get('/', mostrarClientes);

// Ruta para mostrar un Cliente por ID
router.get('/:id', mostrarClientesPorId);

// Ruta para actualizar un Cliente
router.put('/:id', actualizarCliente);

// Ruta para eliminar un Cliente (eliminación lógica)
router.delete('/:id', eliminarCliente);

export default router;