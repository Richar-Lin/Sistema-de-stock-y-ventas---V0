import Sequelize from "sequelize";
import db from "../config/db.js";

export const D_compra = db.define('detallecompras', {
    id_compra: {
        type: Sequelize.INTEGER,
        references: {
            model: 'compras',
            key: 'id'
        }
    },
    id_producto: {
        type: Sequelize.STRING,
        references: {
            model: 'productos', 
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
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    subtotal: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})