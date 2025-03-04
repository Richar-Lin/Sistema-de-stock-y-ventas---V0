import Sequelize from "sequelize";
import db from "../config/db.js";

export const Categoria = db.define('categorias', {
    nombre: {
        type: Sequelize.STRING
    },
    estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})