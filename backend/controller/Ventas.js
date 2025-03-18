import { Venta } from '../models/Venta.js';
import { Producto } from '../models/Producto.js';
import { d_venta } from '../models/D_venta.js';

// Función para mostrar todas las ventas
const mostrarVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            where: { estado: 1 } // Solo obtener ventas activas
        });
        res.json(ventas);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ message: "Error al obtener ventas" });
    }
};


// Función para mostrar un ventas por ID
const obtenerVentasPorIdYCodigo = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        const detalle = await d_venta.findAll({ where: { id_venta: venta.id, estado: 1 } });
        res.json(detalle);
    } catch (error) {
        console.error("Error al obtener ventas por ID y código:", error);
        res.status(500).json({ message: "Error al obtener ventas por ID y código" });
    }
};


const mostrarVentasPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Venta.findByPk(id);
        if (!venta || venta.estado === 0) {
            return res.status(404).json({ message: "Venta no encontrado" });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el Venta" });
    }
};

// Función para obtener el último ID de la tabla ventas
const ultimoId = async (req, res) => {
    try {
        const venta = await Venta.findOne({
            order: [['id', 'DESC']]
        });
        if (!venta) {
            return res.status(404).json({ message: "No se encontraron ventas" });
        }
        res.json({ ultimoCodigo: venta.codigo });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el último ID de la venta" });
    }
};

// Función para guardar un nuevo venta
const guardarventa = async (req, res) => {
    const { codigoVenta, id_cliente, productos, fechaVenta, total } = req.body;

    // Validar los datos entrantes
    if (!codigoVenta || !productos || productos.length === 0) {
        return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    try {
        // Crear la entrada principal en la tabla Venta
        const nuevaVenta = await Venta.create({
            codigo: codigoVenta,
            id_cliente: id_cliente || null, // Permitir valores null para el cliente
            fecha_venta: fechaVenta,
            total: total,
            id_usuario: 8, // Usuario que realiza la venta
            estado: 1 // Venta activa por defecto
        });

        // Crear los detalles de la venta en la tabla D_venta
        const detallesVenta = await Promise.all(productos.map(async (producto) => {
            // Obtener el id del producto a partir del código
            const productoEncontrado = await Producto.findOne({ where: { codigo: producto.codigo } });
            if (!productoEncontrado) {
                throw new Error(`Producto con código ${producto.codigo} no encontrado`);
            }

            // Crear el detalle de la venta
            return await d_venta.create({
                id_venta: nuevaVenta.id, // Relación con la tabla Venta
                id_producto: productoEncontrado.id, // Usar el id del producto encontrado
                cantidad: producto.cantidad,
                iva: producto.iva,
                precio: producto.precio,
                subtotal: producto.subtotal,
                estado: 1 // Activo por defecto
            });
        }));

        res.json({ venta: nuevaVenta, detalles: detallesVenta });

    } catch (error) {
        console.error("Error al guardar la venta:", error.message, error.stack);
        res.status(500).json({ mensaje: 'Error al guardar la venta' });
    }
};

// Función para actualizar un venta
const actualizarVenta = async (req, res) => {
    const { id } = req.params;
    const { ventas, detalles } = req.body;

    try {
        // Actualizar la información general de la venta
        const venta = await Venta.findByPk(id);
        if (!venta || venta.estado === 0) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        venta.codigo = ventas.codigo;
        venta.id_cliente = ventas.id_cliente || null;
        venta.fecha_venta = ventas.fecha_venta;
        venta.total = ventas.total;
        await venta.save();

        // Obtener los detalles existentes de la base de datos
        const detallesExistentes = await d_venta.findAll({ where: { id_venta: id, estado: 1 } });

        // Identificar los detalles que han sido eliminados
        const idsDetallesEnviados = detalles.map((detalle) => detalle.id).filter((id) => id); // Filtrar solo los IDs definidos
        const detallesEliminados = detallesExistentes.filter((detalle) => !idsDetallesEnviados.includes(detalle.id));

        // Cambiar el estado a 0 para los detalles eliminados
        await Promise.all(detallesEliminados.map(async (detalle) => {
            detalle.estado = 0;
            await detalle.save();
        }));

        // Actualizar o crear los detalles enviados
        if (detalles && Array.isArray(detalles)) {
            await Promise.all(detalles.map(async (detalle) => {
                if (detalle.id) {
                    // Actualizar detalle existente
                    const detalleExistente = await d_venta.findByPk(detalle.id);
                    if (detalleExistente) {
                        detalleExistente.id_producto = detalle.id_producto;
                        detalleExistente.cantidad = detalle.cantidad;
                        detalleExistente.precio = detalle.precio;
                        detalleExistente.iva = detalle.iva;
                        detalleExistente.subtotal = detalle.subtotal;
                        await detalleExistente.save();
                    }
                } else {
                    // Crear nuevo detalle
                    await d_venta.create({
                        id_venta: venta.id,
                        id_producto: detalle.id_producto,
                        cantidad: detalle.cantidad,
                        precio: detalle.precio,
                        iva: detalle.iva,
                        subtotal: detalle.subtotal,
                        estado: 1,
                    });
                }
            }));
        }

        res.json({ mensaje: 'Venta actualizada con éxito' });
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        res.status(500).json({ mensaje: 'Error al actualizar la venta' });
    }
};


// Función para eliminar un venta (eliminación lógica)
const eliminarVenta = async (req, res) => {
    const { id } = req.params;

    try {
        const venta = await Venta.findByPk(id);

        if (!venta || venta.estado === 0) {
            return res.status(404).json({ mensaje: 'venta no encontrado' });
        }

        venta.estado = 0; // Cambiar el estado a 0 para desactivar el venta
        await venta.save();
        res.json({ mensaje: 'venta eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar el venta:", error);
        res.status(500).json({ mensaje: 'Error al eliminar el venta' });
    }
};

export {
    obtenerVentasPorIdYCodigo,
    guardarventa,
    mostrarVentas,
    actualizarVenta,
    mostrarVentasPorId,
    eliminarVenta,
    ultimoId
};