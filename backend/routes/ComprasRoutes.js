import express from 'express';
import { 
    obtenerCompraPorIdYCodigo, 
    guardarCompra, 
    ultimoIdCompra, 
    mostrarCompras, 
    mostrarCompraPorId, 
    actualizarCompra, 
    eliminarCompra 
} from '../controller/Compras.js';

const router = express.Router();

// Ruta para guardar una nueva Compra
router.post('/', guardarCompra);

// Ruta para mostrar el último ID de Compra
router.get('/ultimoId', ultimoIdCompra);

// Ruta para mostrar los detalles de una Compra por ID
router.get('/d_compra/:id', obtenerCompraPorIdYCodigo);

// Ruta para mostrar todas las Compras
router.get('/', mostrarCompras);

// Ruta para mostrar una Compra por ID
router.get('/:id', mostrarCompraPorId);

// Ruta para actualizar una Compra
router.put('/:id', actualizarCompra);

// Ruta para eliminar una Compra (eliminación lógica)
router.delete('/:id', eliminarCompra);

export default router;