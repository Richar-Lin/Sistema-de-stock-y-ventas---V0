import Sequelize from "sequelize";
import db from "../config/db.js";

export const Producto = db.define('productos', {
    codigo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.STRING

    },
    precio: {
        type: Sequelize.STRING,
        allowNull: false
    },
    stock: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_categoria: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'categorias', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    id_proveedor: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'proveedores', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})