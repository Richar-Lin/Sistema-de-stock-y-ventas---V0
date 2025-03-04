import { Edit, Trash, Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Asegúrate de que el modal sepa cuál es el elemento raíz de tu aplicación

const Producto = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener los productos desde la API usando axios
        const fetchProductos = async () => {
            try {
                const response = await axios.get('/api/productos');
                if (Array.isArray(response.data)) {
                    setProductos(response.data);
                } else {
                    console.error("La respuesta de la API no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        // Función para obtener las categorías desde la API usando axios
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('/api/categorias');
                if (Array.isArray(response.data)) {
                    setCategorias(response.data);
                } else {
                    console.error("La respuesta de la API no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };

        // Función para obtener los proveedores desde la API usando axios
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('/api/proveedores');
                if (Array.isArray(response.data)) {
                    setProveedores(response.data);
                } else {
                    console.error("La respuesta de la API no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los proveedores:", error);
            }
        };

        fetchProductos();
        fetchCategorias();
        fetchProveedores();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProductos = Array.isArray(productos) ? productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getCategoriaName = (categoriaId) => {
        const categoria = categorias.find(categoria => categoria.id === categoriaId);
        return categoria ? categoria.nombre : "Desconocido";
    };

    const getProveedorName = (proveedorId) => {
        const proveedor = proveedores.find(proveedor => proveedor.id === proveedorId);
        return proveedor ? proveedor.nombre : "Desconocido";
    };

    const openModal = (producto) => {
        setProductoToDelete(producto);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProductoToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/productos/${productoToDelete.id}`);
            setProductos(productos.filter(producto => producto.id !== productoToDelete.id));
            closeModal();
            toast.success("Producto eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            toast.error("Error al eliminar el producto");
        }
    };

    const handleAddProducto = () => {
        navigate('/principal/producto/add'); // Navega a la ruta 'producto/add'
    };

    const handleEditProducto = (id) => {
        navigate(`/principal/producto/edit/${id}`); // Navega a la ruta 'producto/edit'
    };

    return (
        <div className="w-4/5 mx-auto p-10 border border-gray-300 rounded-lg bg-beige-100">
            {/* Enlaces de navegación */}
            <div className="mb-6">
                <Link to="/principal" className="text-blue-500 hover:underline font-bold">
                    PRINCIPAL
                </Link>
                {" / "}
                <Link to="/principal/producto" className="text-blue-500 hover:underline font-bold">
                    PRODUCTO
                </Link>
            </div>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lista Productos</h1>
            </div>
            <div className="flex justify-between items-center mb-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300" onClick={handleAddProducto}>
                    Agregar Producto
                </button>
                <div className="relative">
                    <input
                        type="text"
                        id="search"
                        placeholder="Buscar producto..."
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
                            <th className="border border-black-200 px-4 py-2">Descripción</th>
                            <th className="border border-black-200 px-4 py-2">Precio</th>
                            <th className="border border-black-200 px-4 py-2">Stock</th>
                            <th className="border border-black-200 px-4 py-2">Categoría</th>
                            <th className="border border-black-200 px-4 py-2">Proveedor</th>
                            <th className="border border-black-200 px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.map((producto, index) => (
                            <tr key={producto.id} className="hover:bg-gray-100 transition duration-300 text-center">
                                <td className="border border-black-200 px-4 py-2">{index + 1}</td>
                                <td className="border border-black-200 px-4 py-2">{producto.nombre}</td>
                                <td className="border border-black-200 px-4 py-2">{producto.descripcion}</td>
                                <td className="border border-black-200 px-4 py-2">{producto.precio}</td>
                                <td className="border border-black-200 px-4 py-2">{producto.stock}</td>
                                <td className="border border-black-200 px-4 py-2">{getCategoriaName(producto.id_categoria)}</td>
                                <td className="border border-black-200 px-4 py-2">{getProveedorName(producto.id_proveedor)}</td>
                                <td className="border border-black-200 px-4 py-2 flex justify-around">
                                    <button className="text-blue-500 hover:text-blue-700 transition duration-300" onClick={() => handleEditProducto(producto.id)}>
                                        <Edit size={25} />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 transition duration-300" onClick={() => openModal(producto)}>
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
                <p>¿Estás seguro de que deseas eliminar el producto {productoToDelete?.nombre}?</p>
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

export default Producto;