import { Edit, Trash, Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const Compra = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
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

    // Función para obtener los usuarios desde la API usando axios
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('/api/usuarios');
        if (Array.isArray(response.data)) {
          setUsuarios(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    // Función para obtener las compras desde la API usando axios
    const fetchCompras = async () => {
      try {
        const response = await axios.get('/api/compras');
        if (Array.isArray(response.data)) {
          setCompras(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };

    fetchUsuarios();
    fetchCompras();
    fetchProveedores();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCompras = Array.isArray(compras) ? compras.filter(compra =>
    compra.codigo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getProveedorName = (proveedorId) => {
    const proveedor = proveedores.find(proveedor => proveedor.id === proveedorId);
    return proveedor ? proveedor.nombre : "Desconocido";
  };

  const getUsuarioName = (usuarioID) => {
    const usuario = usuarios.find(usuario => usuario.id === usuarioID);
    return usuario ? usuario.nombre_usuario : "Desconocido";
  };

  const openModal = (compra) => {
    setCompraToDelete(compra);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCompraToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/compras/${compraToDelete.id}`);
      setCompras(compras.filter(compra => compra.id !== compraToDelete.id));
      closeModal();
      toast.success("Compra eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
      toast.error("Error al eliminar la compra");
    }
  };

  const handleAddCompra = () => {
    navigate('/principal/compra/add'); // Navega a la ruta 'compra/add'
  };

  const handleEditCompra = (id) => {
    navigate(`/principal/compra/edit/${id}`); // Navega a la ruta 'compra/edit'
  };

  return (
    <div className="w-4/5 mx-auto p-10 border border-gray-300 rounded-lg bg-beige-100">
      {/* Enlaces de navegación */}
      <div className="mb-6">
        <Link to="/principal" className="text-blue-500 hover:underline font-bold">
          PRINCIPAL
        </Link>
        {" / "}
        <Link to="/principal/compra" className="text-blue-500 hover:underline font-bold">
          COMPRA
        </Link>
      </div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista Compras</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300" onClick={handleAddCompra}>
          Agregar Compra
        </button>
        <div className="relative">
          <input
            type="text"
            id="search"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <Search className="absolute right-2 top-2 text-gray-500" size={25} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse md:border-separate border border-blue-200 w-full bg-white shadow-lg ">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black-200 px-4 py-2">Index</th>
              <th className="border border-black-200 px-4 py-2">Codigo</th>
              <th className="border border-black-200 px-4 py-2">Proveedor</th>
              <th className="border border-black-200 px-4 py-2">Total</th>
              <th className="border border-black-200 px-4 py-2">Fecha</th>
              <th className="border border-black-200 px-4 py-2">Usuario</th>
              <th className="border border-black-200 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompras.map((compra, index) => (
              <tr key={compra.id} className="hover:bg-gray-100 transition duration-300 text-center">
                <td className="border border-black-200 px-4 py-2">{index + 1}</td>
                <td className="border border-black-200 px-4 py-2">{compra.codigo}</td>
                <td className="border border-black-200 px-4 py-2">{compra.id_proveedor ? getProveedorName(compra.id_proveedor) : "Sin proveedor"}</td>
                <td className="border border-black-200 px-4 py-2">{compra.total}</td>
                <td className="border border-black-200 px-4 py-2"> {new Date(new Date(compra.fecha).getTime() + new Date(compra.fecha).getTimezoneOffset() * 60000).toLocaleDateString()}</td>
                <td className="border border-black-200 px-4 py-2">{getUsuarioName(compra.id_usuario)}</td>
                <td className="border border-black-200 px-4 py-2 flex justify-around">
                  <button className="text-blue-500 hover:text-blue-700 transition duration-300" onClick={() => handleEditCompra(compra.id)}>
                    <Edit size={25} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition duration-300" onClick={() => openModal(compra)}>
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
        <p>¿Estás seguro de que deseas eliminar la compra {compraToDelete?.codigo}?</p>
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

export default Compra;