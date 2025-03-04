import { Edit, Trash, Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Asegúrate de que el modal sepa cuál es el elemento raíz de tu aplicación

const Categoria = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [nombre, setNombres] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriasToDelete, setCategoriasToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener las categorias desde la API usando axios
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('/api/categorias');
                if (Array.isArray(response.data)) {
                    setNombres(response.data);
                } else {
                    console.error("La respuesta de la API no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los categorias:", error);
            }
        };

        fetchCategorias();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCategorias = Array.isArray(nombre) ? nombre.filter(categoria =>
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const openModal = (categoria) => {
        setCategoriasToDelete(categoria);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCategoriasToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/categorias/${categoriasToDelete.id}`);
            setNombres(nombre.filter(categoria => categoria.id !== categoriasToDelete.id));
            closeModal();
            toast.success("Categoria eliminada con éxito");
        } catch (error) {
            console.error("Error al eliminar la categoria:", error);
            toast.error("Error al eliminar la categoria");
        }
    };

    const handleAddCategoria = () => {
        navigate('/principal/categoria/add'); // Navega a la ruta 'categoria/add'
    };

    const handleEditCategoria = (id) => {
        navigate(`/principal/categoria/edit/${id}`); // Navega a la ruta 'categoria/edit'
    };

    return (
        <div className="w-4/5 mx-auto p-10 border border-gray-300 rounded-lg bg-beige-100">
            {/* Enlaces de navegación */}
            <div className="mb-6">
                <Link to="/principal" className="text-blue-500 hover:underline font-bold">
                    PRINCIPAL
                </Link>
                {" / "}
                <Link to="/principal/categoria" className="text-blue-500 hover:underline font-bold">
                    CATEGORIA
                </Link>
            </div>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lista de Categorias</h1>
            </div>
            <div className="flex justify-between items-center mb-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300" onClick={handleAddCategoria}>
                    Agregar Categoria
                </button>
                <div className="relative">
                    <input
                        type="text"
                        id="search"
                        placeholder="Buscar categoria..."
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
                            <th className="border border-black-200 px-4 py-2">Nombre</th>
                            <th className="border border-black-200 px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategorias.map((categoria, index) => (
                            <tr key={categoria.id} className="hover:bg-gray-100 transition duration-300 text-center">
                                <td className="border border-black-200 px-4 py-2">{index + 1}</td>
                                <td className="border border-black-200 px-4 py-2">{categoria.nombre}</td>
                                <td className="border border-black-200 px-4 py-2 flex justify-around">
                                    <button className="text-blue-500 hover:text-blue-700 transition duration-300" onClick={() => handleEditCategoria(categoria.id)}>
                                        <Edit size={25} />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 transition duration-300" onClick={() => openModal(categoria)}>
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
                <p>¿Estás seguro de que deseas eliminar al categoria {categoriasToDelete?.nombre}?</p>
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

export default Categoria;