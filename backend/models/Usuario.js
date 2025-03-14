import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";


export const Usuario = db.define('usuarios', {
    nombre_usuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_tipo_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'tipos_usuarios', // Nombre de la tabla relacionada
            key: 'id'
        }
    },
    estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: false,// Evita agregar createdAt y updatedAt automáticamente
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
})

