import Sequelize from "sequelize";
import db from "../config/db.js";

export const d_venta = db.define('detalle_venta', {
    id_venta: {
        type: Sequelize.STRING,
        references: {
            model: 'ventas',
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
        type: Sequelize.INTEGER,
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