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
        // Si no hay ventas, devolver un valor predeterminado
        if (!venta) {
            return res.json({ ultimoCodigo: 0 });
        }
        res.json({ ultimoCodigo: venta.codigo });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el último ID de la venta" });
    }
};

// Función para guardar un nuevo venta
const guardarventa = async (req, res) => {
    const { codigoVenta, id_cliente, productos, fechaVenta, total, usuario } = req.body;

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
            id_usuario: usuario, // Usuario que realiza la venta
            estado: 1 // Venta activa por defecto
        });

        // Crear los detalles de la venta en la tabla D_venta
        const detallesVenta = await Promise.all(productos.map(async (producto) => {
            // Obtener el id del producto a partir del código
            const productoEncontrado = await Producto.findOne({ where: { codigo: producto.codigo } });
            if (!productoEncontrado) {
                throw new Error(`Producto con código ${producto.codigo} no encontrado`);
            }

            // Validar stock
            if (productoEncontrado.stock < producto.cantidad) {
                throw new Error(`Stock insuficiente para el producto con código ${producto.codigo}`);
            }

            // Reducir la cantidad del producto
            productoEncontrado.stock -= producto.cantidad;
            await productoEncontrado.save(); // Guardar los cambios en la base de datos

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
            const producto = await Producto.findByPk(detalle.id_producto);
            producto.stock += detalle.cantidad; // Aumentar la cantidad del producto
            await producto.save(); // Guardar los cambios en la base de datos
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
                        // Obtener el producto anterior
                        const productoAnterior = await Producto.findByPk(detalleExistente.id_producto);

                        // Revertir el stock del producto anterior
                        if (productoAnterior) {
                            productoAnterior.stock += detalleExistente.cantidad; // Devolver el stock anterior
                            await productoAnterior.save();
                        }

                        // Si el producto cambia, actualizar el stock del nuevo producto
                        if (detalleExistente.id_producto !== detalle.id_producto) {
                            const productoNuevo = await Producto.findByPk(detalle.id_producto);
                            if (productoNuevo) {
                                if (productoNuevo.cantidad < detalle.cantidad) {
                                    throw new Error(`Stock insuficiente para el producto con ID ${detalle.id_producto}`);
                                }
                                productoNuevo.cantidad -= detalle.cantidad; // Reducir el stock del nuevo producto
                                await productoNuevo.save();
                            }
                        } else {
                            // Si el producto no cambia, ajustar el stock según la nueva cantidad
                            const productoActual = await Producto.findByPk(detalle.id_producto);
                            if (productoActual) {
                                const diferenciaCantidad = detalle.cantidad - detalleExistente.cantidad;
                                if (productoActual.sotck < diferenciaCantidad) {
                                    throw new Error(`Stock insuficiente para el producto con ID ${detalle.id_producto}`);
                                }
                                productoActual.stock -= detalle.cantidad; // Ajustar el stock
                                await productoActual.save();
                            }
                        }

                        // Actualizar el detalle existente
                        detalleExistente.id_producto = detalle.id_producto;
                        detalleExistente.cantidad = detalle.cantidad;
                        detalleExistente.precio = detalle.precio;
                        detalleExistente.iva = detalle.iva;
                        detalleExistente.subtotal = detalle.subtotal;
                        await detalleExistente.save();
                    }
                } else {
                    // Crear nuevo detalle
                    const productoNuevo = await Producto.findByPk(detalle.id_producto);
                    if (productoNuevo) {
                        if (productoNuevo.cantidad < detalle.cantidad) {
                            throw new Error(`Stock insuficiente para el producto con ID ${detalle.id_producto}`);
                        }
                        productoNuevo.stock -= detalle.cantidad; // Reducir el stock del nuevo producto
                        await productoNuevo.save();
                    }

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

        // Obtener los detalles existentes de la base de datos
        const detalles = await d_venta.findAll({ where: { id_venta: id, estado: 1 } });


        if (!venta || venta.estado === 0) {
            return res.status(404).json({ mensaje: 'venta no encontrado' });
        }


        if (!detalles || detalles.estado === 0) {
            return res.status(404).json({ mensaje: 'd_venta no encontrado' });
        }

        Promise.all(detalles.map(async (detalle) => {
            const producto = await Producto.findByPk(detalle.id_producto);
            producto.cantidad += detalle.cantidad; // Aumentar la cantidad del producto
            await producto.save(); // Guardar los cambios en la base de datos
            detalle.estado = 0; // Cambiar el estado a 0 para desactivar el detalle
            await detalle.save();
        }));
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