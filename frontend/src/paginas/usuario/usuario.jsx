import { Edit, Trash, Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Asegúrate de que el modal sepa cuál es el elemento raíz de tu aplicación

const Usuario = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener los usuarios desde la API usando axios
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/usuarios');
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error("La respuesta de la API no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };

        // Función para obtener los roles desde la API usando axios
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                if (Array.isArray(response.data)) {
                    setRoles(response.data);
                } else {
                    console.error("La respuesta de la API no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los roles:", error);
            }
        };

        fetchUsers();
        fetchRoles();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getRoleName = (roleId) => {
        const role = roles.find(role => role.id === roleId);
        return role ? role.tipo_usuario : "Desconocido";
    };

    const openModal = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/usuarios/${userToDelete.id}`);
            setUsers(users.filter(user => user.id !== userToDelete.id));
            closeModal();
            toast.success("Usuario eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            toast.error("Error al eliminar el usuario");
        }
    };

    const handleAddUser = () => {
        navigate('/principal/usuario/add'); // Navega a la ruta 'usuario/add'
    };

    const handleEditUser = (id) => {
        navigate(`/principal/usuario/edit/${id}`); // Navega a la ruta 'usuario/edit'
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
            </div>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lista Usuarios</h1>
            </div>
            <div className="flex justify-between items-center mb-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300" onClick={handleAddUser}>
                    Agregar Usuario
                </button>
                <div className="relative">
                    <input
                        type="text"
                        id="search"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                    <Search className="absolute right-2 top-2 text-gray-500" size={25} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="border-collapse md:border-separate border border-blue-200 w-full bg-white shadow-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-black-200 px-4 py-2">Index</th>
                            <th className="border border-black-200 px-4 py-2">Usuario</th>
                            <th className="border border-black-200 px-4 py-2">Rol</th>
                            <th className="border border-black-200 px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-100 transition duration-300 text-center">
                                <td className="border border-black-200 px-4 py-2">{index + 1}</td>
                                <td className="border border-black-200 px-4 py-2">{user.nombre_usuario}</td>
                                <td className="border border-black-200 px-4 py-2">{getRoleName(user.id_tipo_usuario)}</td>
                                <td className="border border-black-200 px-4 py-2 flex justify-around">
                                    <button className="text-blue-500 hover:text-blue-700 transition duration-300" onClick={() => handleEditUser(user.id)}>
                                        <Edit size={25} />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 transition duration-300" onClick={() => openModal(user)}>
                                        <Trash size={25} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Confirmar eliminación"
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
                overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl mb-4">Confirmar eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar al usuario {userToDelete?.nombre_usuario}?</p>
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-300"
                        onClick={closeModal}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Usuario;