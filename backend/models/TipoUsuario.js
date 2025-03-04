import Sequelize from "sequelize";
import db from "../config/db.js";



export const TipoUsuario = db.define('tipos_usuarios', {
    tipo_usuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: false,// Evita agregar createdAt y updatedAt automáticamente
})

