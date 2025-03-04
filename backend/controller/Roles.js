import { TipoUsuario } from "../models/tipousuario.js"; // Asegúrate de que este modelo existe

export const obtenerRoles = async (req, res) => {
  try {
    const roles = await TipoUsuario.findAll();
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    res.status(500).json({ error: "Error al obtener los roles" });
  }
};