import express from 'express';
import {  obtenerVentasPorIdYCodigo, guardarventa, ultimoId, mostrarVentas, mostrarVentasPorId, actualizarVenta, eliminarVenta } from '../controller/Ventas.js';


const router = express.Router();

// Ruta para guardar un nuevo Venta
router.post('/', guardarventa);

// Ruta para mostarar el ultimo id
router.get('/ultimoId', ultimoId);

router.get('/:id', obtenerVentasPorIdYCodigo);

// Ruta para mostrar todos los Venta
router.get('/', mostrarVentas);

// Ruta para mostrar un Venta por ID
router.get('/:id', mostrarVentasPorId);

// Ruta para actualizar un Venta
router.put('/:id', actualizarVenta);

// Ruta para eliminar un Venta (eliminación lógica)
router.delete('/:id', eliminarVenta);

export default router;