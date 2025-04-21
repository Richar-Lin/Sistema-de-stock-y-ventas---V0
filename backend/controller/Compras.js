import { Compra } from '../models/Compra.js';
import { Producto } from '../models/Producto.js';
import { D_compra } from '../models/D_compra.js';

// Función para mostrar todas las compras
const mostrarCompras = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            where: { estado: 1 } // Solo obtener compras activas
        });
        res.json(compras);
    } catch (error) {
        console.error("Error al obtener compras:", error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
};

// Función para mostrar una compra por ID
const obtenerCompraPorIdYCodigo = async (req, res) => {
    const { id } = req.params;
    try {
        const compra = await Compra.findByPk(id);
        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        const detalle = await D_compra.findAll({ where: { id_compra: compra.id, estado: 1 } });
        res.json(detalle);
    } catch (error) {
        console.error("Error al obtener compra por ID y código:", error);
        res.status(500).json({ message: "Error al obtener compra por ID y código" });
    }
};

const mostrarCompraPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const compra = await Compra.findByPk(id);
        if (!compra || compra.estado === 0) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        res.json(compra);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la compra" });
    }
};

// Función para obtener el último ID de la tabla compras
const ultimoIdCompra = async (req, res) => {
    try {
        const compra = await Compra.findOne({
            order: [['id', 'DESC']]
        });
        // Si no hay compras, devolver un valor predeterminado
        if (!compra) {
            return res.json({ ultimoCodigo: 0 });
        }
        res.json({ ultimoCodigo: compra.codigo });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el último ID de la compra" });
    }
};

// Función para guardar una nueva compra
const guardarCompra = async (req, res) => {
    const { codigoCompra, id_proveedor, productos, fechaCompra, total, usuario } = req.body;

    // Validar los datos entrantes
    if (!codigoCompra || !productos || productos.length === 0) {
        return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    console.log("Datos recibidos en el backend:", req.body); // Agregar este log

    try {
        // Crear la entrada principal en la tabla Compra
        const nuevaCompra = await Compra.create({
            codigo: codigoCompra,
            id_proveedor: id_proveedor || null, // Permitir valores null para el proveedor
            fecha: fechaCompra,
            total: parseFloat(total),
            id_usuario: usuario, // Usuario que realiza la compra
            estado: 1 // Compra activa por defecto
        });

        // Crear los detalles de la compra en la tabla D_compra
        const detallesCompra = await Promise.all(productos.map(async (producto) => {
            // Obtener el id del producto a partir del código
            const productoEncontrado = await Producto.findOne({ where: { codigo: producto.codigo } });
            if (!productoEncontrado) {
                throw new Error(`Producto con código ${producto.codigo} no encontrado`);
            }

            // Aumentar la cantidad del producto
            productoEncontrado.stock += parseInt(producto.cantidad); // Asegurarse de que la cantidad sea un número entero
            await productoEncontrado.save(); // Guardar los cambios en la base de datos

            // Crear el detalle de la compra
            return await D_compra.create({
                id_compra: nuevaCompra.id,
                id_producto: productoEncontrado.id,
                cantidad: parseInt(producto.cantidad, 10), // Convertir cantidad a entero
                iva: parseFloat(producto.iva), // Convertir IVA a decimal
                precio: parseFloat(producto.precio), // Convertir precio a decimal
                subtotal: parseFloat(producto.subtotal), // Convertir subtotal a decimal
                estado: 1
            });;
        }));

        res.json({ compra: nuevaCompra, detalles: detallesCompra });

    } catch (error) {
        console.error("Error al guardar la compra:", error.message, error.stack);
        res.status(500).json({ mensaje: 'Error al guardar la compra' });
    }
};

// Función para actualizar una compra
const actualizarCompra = async (req, res) => {
    const { id } = req.params;
    const { compra, detalles } = req.body;

    try {
        // Actualizar la información general de la compra
        const compras = await Compra.findByPk(id);
        if (!compra || compra.estado === 0) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }
        console.log("Datos recibidos en el backend para actualizar:", req.body); // Agregar este log
        compras.codigo = compra.codigo;
        compras.id_proveedor = compra.id_proveedor || null; // Permitir valores null para el proveedor
        compras.fecha = compra.fecha;
        compras.total = parseFloat(compra.total);
        compras.id_usuario = compra.usuario; // Usuario que realiza la compra
        await compras.save(); // Guardar los cambios en la base de datos

        // Obtener los detalles existentes de la base de datos
        const detallesExistentes = await D_compra.findAll({ where: { id_compra: id, estado: 1 } });

        // Identificar los detalles que han sido eliminados
        const idsDetallesEnviados = detalles.map((detalle) => detalle.id).filter((id) => id); // Filtrar solo los IDs definidos
        const detallesEliminados = detallesExistentes.filter((detalle) => !idsDetallesEnviados.includes(detalle.id));

        // Cambiar el estado a 0 para los detalles eliminados
        await Promise.all(detallesEliminados.map(async (detalle) => {
            const producto = await Producto.findByPk(detalle.id_producto);
            producto.stock -= detalle.cantidad; // Reducir la cantidad del producto
            await producto.save(); // Guardar los cambios en la base de datos
            detalle.estado = 0;
            await detalle.save();
        }));

        // Actualizar o crear los detalles enviados
        if (detalles && Array.isArray(detalles)) {
            await Promise.all(detalles.map(async (detalle) => {
                if (detalle.id) {
                    // Actualizar detalle existente
                    const detalleExistente = await D_compra.findByPk(detalle.id);
                    if (detalleExistente) {
                        // Obtener el producto anterior
                        const productoAnterior = await Producto.findByPk(detalleExistente.id_producto);

                   
                        // Si el producto cambia, actualizar el stock del nuevo producto
                        if (detalleExistente.id_producto !== detalle.id_producto) {
                            const productoNuevo = await Producto.findByPk(detalle.id_producto);
                            if (productoNuevo) {
                                productoNuevo.stock += detalle.cantidad; // Aumentar el stock del nuevo producto
                                await productoNuevo.save();
                            }
                        } else {
                            // Si el producto no cambia, ajustar el stock según la nueva cantidad
                            const productoActual = await Producto.findByPk(detalle.id_producto);
                            if (productoActual) {
                                const diferenciaCantidad = detalle.cantidad - detalleExistente.cantidad;
                                productoActual.stock += diferenciaCantidad; // Ajustar el stock
                                await productoActual.save();
                            }
                        }

                        // Actualizar el detalle existente
                        detalleExistente.id_producto = detalle.id_producto;
                        detalleExistente.cantidad = detalle.cantidad;
                        detalleExistente.precio_unitario = detalle.precio;
                        detalleExistente.subtotal = detalle.subtotal;
                        await detalleExistente.save();
                    }
                } else {
                    // Crear nuevo detalle
                    const productoNuevo = await Producto.findByPk(detalle.id_producto);
                    if (productoNuevo) {
                        productoNuevo.stock += detalle.cantidad; // Aumentar el stock del nuevo producto
                        await productoNuevo.save();
                    }

                    await D_compra.create({
                        id_compra: compras.id,
                        id_producto: detalle.id_producto,
                        cantidad: detalle.cantidad,
                        precio_unitario: detalle.precio,
                        subtotal: detalle.subtotal,
                        estado: 1,
                    });
                }
            }));
        }

        res.json({ mensaje: 'Compra actualizada con éxito' });
    } catch (error) {
        console.error("Error al actualizar la compra:", error);
        res.status(500).json({ mensaje: 'Error al actualizar la compra' });
    }
};

// Función para eliminar una compra (eliminación lógica)
const eliminarCompra = async (req, res) => {
    const { id } = req.params;

    try {
        const compra = await Compra.findByPk(id);

        // Obtener los detalles existentes de la base de datos
        const detalles = await D_compra.findAll({ where: { id_compra: id, estado: 1 } });

        if (!compra || compra.estado === 0) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        await Promise.all(detalles.map(async (detalle) => {
            const producto = await Producto.findByPk(detalle.id_producto);
            producto.stock -= detalle.cantidad; // Reducir la cantidad del producto
            await producto.save(); // Guardar los cambios en la base de datos
            detalle.estado = 0; // Cambiar el estado a 0 para desactivar el detalle
            await detalle.save();
        }));
        compra.estado = 0; // Cambiar el estado a 0 para desactivar la compra
        await compra.save();

        res.json({ mensaje: 'Compra eliminada con éxito' });
    } catch (error) {
        console.error("Error al eliminar la compra:", error);
        res.status(500).json({ mensaje: 'Error al eliminar la compra' });
    }
};

export {
    obtenerCompraPorIdYCodigo,
    guardarCompra,
    mostrarCompras,
    actualizarCompra,
    mostrarCompraPorId,
    eliminarCompra,
    ultimoIdCompra
};