import express from "express";
import path from "path";
import db from "./config/db.js";
import dotenv from 'dotenv';
import usuarioRoutes from "./routes/UsuarioRoutes.js";
import rolesRoutes from "./routes/RolesRoutes.js";
import proveedoresRoutes from "./routes/ProveedoresRoutes.js";
import categoriasRoutes from "./routes/CategoriaRoutes.js";
import clientesRoutes from "./routes/ClientesRoutes.js";
import productosRoutes from "./routes/ProductosRoutes.js"
import ventasRoutes from "./routes/VentasRoutes.js";
import comprasRoutes from "./routes/ComprasRoutes.js";


// Cargar las variables de entorno desde el archivo .env
dotenv.config();
//dotenv.config({ path: './.env' });

const app = express();

// Conectar a la base de datos
db.authenticate()
    .then(() => console.log('Base de datos conectada'))
    .catch(error => console.log(error));

// Definir el puerto
const PORT = process.env.PORT || 4000;

// Middleware para parsear JSON
app.use(express.json());


// Usar las rutas de usuario
app.use('/api/usuarios', usuarioRoutes);

// Usar las rutas de roles
app.use('/api/roles', rolesRoutes); // Añade las rutas de roles

// Usar las rutas de proveedores
app.use('/api/proveedores', proveedoresRoutes);

// Usar las rutas de categorias
app.use('/api/categorias', categoriasRoutes);

// Usar las rutas de categorias
app.use('/api/clientes', clientesRoutes);

// Usar las rutas de productos
app.use('/api/productos', productosRoutes);

// Usar las rutas de ventas
app.use('/api/ventas', ventasRoutes);

// Usar las rutas de compras
app.use('/api/compras', comprasRoutes);

// Servir archivos estáticos de React
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Manejar todas las demás rutas y servir el archivo index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});