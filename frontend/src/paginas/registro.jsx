import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import imagen from '../assets/logo.png';

const Resgister = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener los roles desde el backend
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                console.log(response.data); // Verifica la estructura de los datos aquí
                setRoles(response.data);
            } catch (error) {
                console.error("Error al obtener los roles:", error);
            }
        };

        fetchRoles();
    }, []);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const nuevoUsuario = {
                nombre_usuario: nombre,
                password, // Asegúrate de que estás usando la variable correcta
                id_tipo_usuario: selectedRole
            };
            await axios.post('/api/usuarios', nuevoUsuario);
            toast.success("Usuario agregado con éxito");
            navigate('/');
        } catch (error) {
            console.error("Error al agregar el usuario:", error);
            toast.error("Error al agregar el usuario");
        }
    };


    return (
        <div className="shadow-lg px-5 py-12 rounded-xl bg-gray-100 w-full max-w-2xl">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center mb-10">
                    <img src={imagen} className="w-40 h-40 rounded-full" />
                </div>
                <div className="mb-5 mx-10">
                    <label htmlFor="username" className="block text-gray-600 text-2xl font-bold mb-3">
                        Usuario 👨‍💼:
                    </label>
                    <input
                        type="text"
                        id="username"
                        autoComplete="current-username"
                        placeholder="Ingrese su Usuario"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={nombre}
                        onChange={handleNombreChange}
                        required
                    />
                </div>
                <div className="mb-5 mx-10">
                    <label htmlFor="password" className="block text-gray-600 text-2xl font-bold mb-3">
                        Password 🔒:
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Ingrese su Contraseña"
                        autoComplete="current-password"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="mb-10 mx-10">
                    <label htmlFor="rol" className="block text-gray-600 text-2xl font-bold mb-3">Rol</label>
                    <select id="rol" name="rol" className="p-2 border border-gray-300 rounded w-full" value={selectedRole} onChange={handleRoleChange}>
                        <option value="">Seleccione un rol</option>
                        {roles.map((rol) => (
                            <option key={rol.id} value={rol.id}>{rol.tipo_usuario}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="w-auto bg-indigo-700 py-3 px-10 rounded-xl font-bold text-white hover:bg-indigo-800 transition duration-300 ease-in-out"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Resgister;