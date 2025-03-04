import express from 'express';
import { obtenerRoles } from '../controller/Roles.js';

const router = express.Router();

// Ruta para obtener todos los roles
router.get('/', obtenerRoles);

export default router;