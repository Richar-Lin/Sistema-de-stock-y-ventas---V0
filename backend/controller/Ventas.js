import { Venta } from '../models/Venta.js';
import { Producto } from '../models/Producto.js';

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

const obtenerVentasPorIdYCodigo = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        const ventas = await Venta.findAll({ where: { codigo: venta.codigo } });
        res.json(ventas);
    } catch (error) {
        console.error("Error al obtener ventas por ID y código:", error);
        res.status(500).json({ message: "Error al obtener ventas por ID y código" });
    }
};

// Función para mostrar un ventas por ID
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
    const { codigoVenta, id_cliente, productos, fechaVenta } = req.body;

    // Validar los datos entrantes
    if (!codigoVenta || !productos || productos.length === 0) {
        return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    try {
        const ventas = await Promise.all(productos.map(async (producto) => {
            // Obtener el id del producto a partir del codigo
            const productoEncontrado = await Producto.findOne({ where: { codigo: producto.codigo } });
            if (!productoEncontrado) {
                throw new Error(`Producto con código ${producto.codigo} no encontrado`);
            }

            const nuevaVenta = await Venta.create({
                codigo: codigoVenta,
                id_cliente: id_cliente || null, // Permitir valores null
                id_producto: productoEncontrado.id, // Usar el id del producto encontrado
                id_usuario: producto.id_usuario || 8, // Permitir valores null
                cantidad: producto.cantidad,
                iva: producto.iva,
                fecha_venta: fechaVenta,
                precio: producto.precio,
                total: producto.total,
                estado: 1 // venta activo por defecto
            });
            return nuevaVenta;
        }));

        res.json(ventas);
    } catch (error) {
        console.error("Error al guardar el venta:", error.message, error.stack);
        res.status(500).json({ mensaje: 'Error al guardar el venta' });
    }
};

// Función para actualizar un venta
const actualizarVenta = async (req, res) => {
    const { id } = req.params;
    const { codigo, id_cliente, id_producto, cantidad, precio, total, iva, fecha_venta } = req.body;

    try {
        const venta = await Venta.findByPk(id);

        if (!venta || venta.estado === 0) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        // Actualizar la venta específica
        venta.codigo = codigo;
        venta.id_cliente = id_cliente || "sin cliente"; // Permitir valores null
        venta.id_producto = id_producto;
        venta.cantidad = cantidad;
        venta.iva = iva;
        venta.precio = precio;
        venta.total = total;
        venta.fecha_venta = fecha_venta;

        await venta.save();

        // Actualizar todas las ventas con el mismo código
        const ventasConMismoCodigo = await Venta.findAll({ where: { codigo: venta.codigo } });

        await Promise.all(ventasConMismoCodigo.map(async (ventaConMismoCodigo) => {
            ventaConMismoCodigo.id_cliente = id_cliente || "sin cliente"; // Permitir valores null
            ventaConMismoCodigo.fecha_venta = fecha_venta;
            await ventaConMismoCodigo.save();
        }));

        res.json(venta);
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