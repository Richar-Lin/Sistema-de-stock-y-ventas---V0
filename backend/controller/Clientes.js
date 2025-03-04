import { Cliente } from "../models/Cliente.js";

// Función para mostrar todos los clientes
const mostrarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            where: { estado: 1 } // Solo obtener cliente activos
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};

// Función para mostrar un clientes por ID
const mostrarClientesPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente || cliente.estado === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
};

// Función para guardar un nuevo cliente
const guardarCliente = async (req, res) => {
    const { nombre, telefono, email, direccion } = req.body;

    // Almacenar en la BD
    try {
        const nuevoCliente= await Cliente.create({
            nombre,
            telefono: telefono || "sin teléfono", // Permitir valores null
            email: email || "sin email", // Permitir valores null
            direccion: direccion || "sin direccion", // Permitir valores null
            estado: 1 // cliente activo por defecto
        });

        res.json(nuevoCliente);
    } catch (error) {
        console.error("Error al guardar el cliente:", error);
        res.status(500).json({ mensaje: 'Error al guardar el cliente' });
    }
};

// Función para actualizar un cliente
const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, direccion } = req.body;

    try {
        const cliente = await Cliente.findByPk(id);

        if (!cliente || cliente.estado === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        cliente.nombre = nombre;
        cliente.telefono = telefono || "sin teléfono"; // Permitir valores null
        cliente.email = email || "sin email"; // Permitir valores null
        cliente.direccion = direccion || "sin direccion"; // Permitir valores null

        await cliente.save();
        res.json(cliente);
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ mensaje: 'Error al actualizar el cliente' });
    }
};

// Función para eliminar un cliente (eliminación lógica)
const eliminarCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await Cliente.findByPk(id);

        if (!cliente || cliente.estado === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        cliente.estado = 0; // Cambiar el estado a 0 para desactivar el cliente
        await cliente.save();
        res.json({ mensaje: 'Cliente eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ mensaje: 'Error al eliminar el cliente' });
    }
};

export {
    guardarCliente,
    mostrarClientes,
    actualizarCliente,
    mostrarClientesPorId,
    eliminarCliente
};