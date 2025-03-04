import express from 'express';
import { autenticar, guardarUsuario, mostrarUsuarios, mostrarUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../controller/Usuarios.js';

const router = express.Router();

// Ruta para autenticar un usuario
router.post('/login', autenticar);

// Ruta para guardar un nuevo usuario
router.post('/', guardarUsuario);

// Ruta para mostrar todos los usuarios
router.get('/', mostrarUsuarios);

// Ruta para mostrar un usuario por ID
router.get('/:id', mostrarUsuarioPorId);

// Ruta para actualizar un usuario
router.put('/:id', actualizarUsuario);

// Ruta para eliminar un usuario (eliminación lógica)
router.delete('/:id', eliminarUsuario);

export default router;