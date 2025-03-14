import Sequelize from "sequelize";
import db from "../config/db.js";

export const Venta = db.define('ventas', {
    codigo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_cliente: {
        type: Sequelize.STRING,
        references: {
            model: 'clientes', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    id_producto: {
        type: Sequelize.STRING,
        references: {
            model: 'productos', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    iva: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    precio: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    total: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    fecha_venta: {
        type: Sequelize.DATE,
        allowNull: false
    },
    id_usuario: {
        type: Sequelize.STRING,
        references: {
            model: 'usuarios', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})