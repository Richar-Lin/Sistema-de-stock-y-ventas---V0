import Sequelize from "sequelize";
import db from "../config/db.js";

export const Compra = db.define('compras', {
    codigo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_proveedor: {
        type: Sequelize.STRING,
        references: {
            model: 'proveedores', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    fecha: {
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