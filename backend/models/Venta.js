import  Sequelize  from "sequelize";
import db from "../config/db.js";

export const categoria = db.define('ventas', {
    nombre: {
        type: Sequelize.STRING
    }
})