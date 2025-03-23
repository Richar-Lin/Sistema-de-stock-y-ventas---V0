import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";
import generarJWT from "../helper/generarJWT.js";

// Función para mostrar todos los usuarios
const mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { estado: 1 } // Solo obtener usuarios activos
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Función para mostrar un usuario por ID
const mostrarUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario || usuario.estado === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
// Función para guardar un nuevo usuario
const guardarUsuario = async (req, res) => {
  const { nombre_usuario, password, id_tipo_usuario } = req.body;

  const errores = [];

  if (!nombre_usuario) {
    errores.push({ 'mensaje': 'Agrega tu Nombre' });
  }
  if (!password) {
    errores.push({ 'mensaje': 'Tu Contraseña es Obligatoria' });
  }
  if (!id_tipo_usuario) {
    errores.push({ 'mensaje': 'Selecciona un Tipo de Usuario' });
  }

  // Revisar por errores
  if (errores.length > 0) {
    const usuarios = await Usuario.findAll();

    // Muestra la vista con errores
    res.status(400).json({
      errores,
      nombre_usuario,
      password,
      id_tipo_usuario,
      usuarios,
      pagina: 'Usuarios'
    });
  } else {
    // Almacenar en la BD
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nuevoUsuario = await Usuario.create({
        nombre_usuario,
        password: hashedPassword,
        id_tipo_usuario,
        estado: 1 // Usuario activo por defecto
      });

      res.json(nuevoUsuario);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      res.status(500).json({ mensaje: 'Error al guardar el usuario' });
    }
  }
};


// Función para autenticar un usuario
const autenticar = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  try {
    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { nombre_usuario: nombre_usuario } });


    if (!usuario) {
      return res.status(404).json({ mensaje: 'El Usuario no existe' });
    }

    console.log("Usuario encontrado:", usuario);
    // Verificar si tiene una contraseña registrada
    if (!usuario.password) {
      return res.status(500).json({ mensaje: 'Error: el usuario no tiene contraseña registrada' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    console.log("Resultado de la comparación:", passwordValido);

    if (!passwordValido) {
      return res.status(403).json({ mensaje: 'El Password es incorrecto' });
    }

    // Autenticar y generar token
    const token = generarJWT(usuario.id);
    if (!token) {
      return res.status(500).json({ mensaje: 'Error al generar el token' });
    }

    res.json({
      id: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      id_tipo_usuario: usuario.id_tipo_usuario,
      token,
      id: usuario.id,
    });

  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({ mensaje: 'Error al autenticar el usuario' });
  }
};


// Función para actualizar un usuario
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, contrasena, id_tipo_usuario } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario || usuario.estado === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.nombre_usuario = nombre_usuario;
    usuario.id_tipo_usuario = id_tipo_usuario;

    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      usuario.contrasena = await bcrypt.hash(contrasena, salt);
    }

    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
};
// Función para eliminar un usuario (eliminación lógica)
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario || usuario.estado === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.estado = 0; // Cambiar el estado a 0 para desactivar el usuario
    await usuario.save();
    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
};

export {
  guardarUsuario,
  mostrarUsuarioPorId,
  autenticar,
  actualizarUsuario,
  mostrarUsuarios,
  eliminarUsuario
};