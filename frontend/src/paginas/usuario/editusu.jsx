import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Editusu = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");
    const { id } = useParams(); // Obtener el ID del usuario desde los parámetros de la URL
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener los roles desde el backend
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                setRoles(response.data);
            } catch (error) {
                console.error("Error al obtener los roles:", error);
            }
        };

        // Obtener los datos del usuario desde el backend
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/usuarios/${id}`);
                const user = response.data;
                setNombre(user.nombre_usuario);
                setSelectedRole(user.id_tipo_usuario);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        fetchRoles();
        fetchUser();
    }, [id]);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleContrasenaChange = (event) => {
        setContrasena(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedUser = {
                nombre_usuario: nombre,
                contrasena, // Asegúrate de que estás usando la variable correcta
                id_tipo_usuario: selectedRole
            };
            await axios.put(`/api/usuarios/${id}`, updatedUser);
            toast.success("Usuario actualizado con éxito");
            navigate('/principal/usuario');
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            toast.error("Error al actualizar el usuario");
        }
    };

    return (
        <div className="w-4/5 mx-auto p-10 border border-gray-300 rounded-lg bg-beige-100">
            {/* Enlaces de navegación */}
            <div className="mb-6">
                <Link to="/principal" className="text-blue-500 hover:underline font-bold">
                    PRINCIPAL
                </Link>
                {" / "}
                <Link to="/principal/usuario" className="text-blue-500 hover:underline font-bold">
                    USUARIO
                </Link>
                {" / "}
                <Link to="/principal/usuario/edit" className="text-blue-500 hover:underline font-bold">
                    EDITAR
                </Link>
            </div>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Editar Usuarios</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="nombre" className="font-bold">Nombre</label>
                        <input type="text" id="nombre" name="nombre" autoComplete="username" className="p-2 border border-gray-300 rounded w-full" value={nombre} onChange={handleNombreChange} />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="contrasena" className="font-bold">Contraseña</label>
                        <input type="password" id="contrasena" name="contrasena" autoComplete="current-password" className="p-2 border border-gray-300 rounded w-full" value={contrasena} onChange={handleContrasenaChange} />
                    </div>
                    <div className="flex flex-col space-y-2 pb-5">
                        <label htmlFor="rol" className="font-bold">Rol</label>
                        <select id="rol" name="rol" className="p-2 border border-gray-300 rounded w-full" value={selectedRole} onChange={handleRoleChange}>
                            <option value="">Seleccione un rol</option>
                            {roles.map((rol) => (
                                <option key={rol.id} value={rol.id}>{rol.tipo_usuario}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default Editusu;