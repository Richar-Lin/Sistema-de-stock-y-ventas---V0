import { Producto } from "../models/Producto.js";


// Función para mostrar todos los productos
const mostrarPrdocutos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            where: { estado: 1 } // Solo obtener productos activos
        });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener producto" });
    }
};

// Función para mostrar un producto por ID
const mostrarProductoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto || producto.estado === 0) {
            return res.status(404).json({ message: "producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};

// Función para guardar un nuevo producto
const guardarProducto = async (req, res) => {
    const { codigo, nombre, descripcion, precio, stock, id_categoria, id_proveedor } = req.body;

    try {
        const nuevoProducto = await Producto.create({
            codigo,
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria,
            id_proveedor,
            estado: 1 // producto activo por defecto
        });

        res.json(nuevoProducto);
    } catch (error) {
        console.error("Error al guardar el producto:", error);
        res.status(500).json({ mensaje: 'Error al guardar el producto' });
    }

};

// Función para actualizar un producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, descripcion, precio, stock, id_categoria, id_proveedor } = req.body;

    try {
        const producto = await Producto.findByPk(id);

        if (!producto || producto.estado === 0) {
            return res.status(404).json({ mensaje: 'producto no encontrado' });
        }

        producto.codigo = codigo
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.stock = stock;
        producto.id_categoria = id_categoria;
        producto.id_proveedor = id_proveedor;


        await producto.save();
        res.json(producto);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
};

// Función para eliminar un usuaproductorio (eliminación lógica)
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findByPk(id);

        if (!producto || producto.estado === 0) {
            return res.status(404).json({ mensaje: 'producto no encontrado' });
        }

        producto.estado = 0; // Cambiar el estado a 0 para desactivar el producto
        await producto.save();
        res.json({ mensaje: 'producto eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
};


export {
    guardarProducto,
    mostrarProductoPorId,
    actualizarProducto,
    mostrarPrdocutos,
    eliminarProducto
};