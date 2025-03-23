import { Edit, Trash, Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const Venta = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    // Función para obtener los clientes desde la API usando axios
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clientes');
        if (Array.isArray(response.data)) {
          setClientes(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    // Función para obtener los productos desde la API usando axios
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('/api/usuarios');
        if (Array.isArray(response.data)) {
          setUsuarios(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    // Función para obtener las ventas desde la API usando axios
    const fetchVentas = async () => {
      try {
        const response = await axios.get('/api/ventas');
        if (Array.isArray(response.data)) {
          setVentas(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    fetchUsuarios();
    fetchVentas();
    fetchClientes();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVentas = Array.isArray(ventas) ? ventas.filter(venta =>
    venta.codigo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getClienteName = (clienteId) => {
    const cliente = clientes.find(cliente => cliente.id === clienteId);
    return cliente ? cliente.nombre : "Desconocido";
  };

  const getUsuarioName = (usuarioID) => {
    const usuario = usuarios.find(usuario => usuario.id === usuarioID);
    return usuario ? usuario.nombre_usuario : "Desconocido";
  };

  const openModal = (venta) => {
    setVentaToDelete(venta);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVentaToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/ventas/${ventaToDelete.id}`);
      setVentas(ventas.filter(venta => venta.id !== ventaToDelete.id));
      closeModal();
      toast.success("Venta eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      toast.error("Error al eliminar la venta");
    }
  };

  const handleAddVenta = () => {
    navigate('/principal/venta/add'); // Navega a la ruta 'venta/add'
  };

  const handleEditVenta = (id) => {
    navigate(`/principal/venta/edit/${id}`); // Navega a la ruta 'venta/edit'
  };

  return (
    <div className="w-4/5 mx-auto p-10 border border-gray-300 rounded-lg bg-beige-100">
      {/* Enlaces de navegación */}
      <div className="mb-6">
        <Link to="/principal" className="text-blue-500 hover:underline font-bold">
          PRINCIPAL
        </Link>
        {" / "}
        <Link to="/principal/venta" className="text-blue-500 hover:underline font-bold">
          VENTA
        </Link>
      </div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista Ventas</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300" onClick={handleAddVenta}>
          Agregar Venta
        </button>
        <div className="relative">
          <input
            type="text"
            id="search"
            placeholder="Buscar venta..."
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
              <th className="border border-black-200 px-4 py-2">Cliente</th>
              <th className="border border-black-200 px-4 py-2">Total</th>
              <th className="border border-black-200 px-4 py-2">Fecha</th>
              <th className="border border-black-200 px-4 py-2">Usuario</th>
              <th className="border border-black-200 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map((venta, index) => (
              <tr key={venta.id} className="hover:bg-gray-100 transition duration-300 text-center">
                <td className="border border-black-200 px-4 py-2">{index + 1}</td>
                <td className="border border-black-200 px-4 py-2">{venta.codigo}</td>
                <td className="border border-black-200 px-4 py-2">{venta.id_cliente ? getClienteName(venta.id_cliente) : "Sin cliente"}</td>
                <td className="border border-black-200 px-4 py-2">{venta.total}</td>
                <td className="border border-black-200 px-4 py-2"> {new Date(new Date(venta.fecha_venta).getTime() + new Date(venta.fecha_venta).getTimezoneOffset() * 60000).toLocaleDateString()}</td>
                <td className="border border-black-200 px-4 py-2">{getUsuarioName(venta.id_usuario)}</td>
                <td className="border border-black-200 px-4 py-2 flex justify-around">
                  <button className="text-blue-500 hover:text-blue-700 transition duration-300" onClick={() => handleEditVenta(venta.id)}>
                    <Edit size={25} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition duration-300" onClick={() => openModal(venta)}>
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
        <p>¿Estás seguro de que deseas eliminar la venta {ventaToDelete?.codigo}?</p>
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

export default Venta;