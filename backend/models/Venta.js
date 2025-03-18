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
    fecha_venta: {
        type: Sequelize.DATE,
        allowNull: false
    },
    total: {
        type: Sequelize.DECIMAL,
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