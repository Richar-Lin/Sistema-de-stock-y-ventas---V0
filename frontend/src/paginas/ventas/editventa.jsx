import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Search, Plus, Trash } from "lucide-react";
import Modal from "react-modal";

const Editventa = () => {
  const { id } = useParams();
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get(`/api/ventas/${id}`);
        setVentas(response.data);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get('/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchVentas();
    fetchClientes();
    fetchProductos();
  }, [id]);

  const handleInputChange = (index, field, value) => {
    const newVentas = [...ventas];
    newVentas[index][field] = value;

    if (field === 'cantidad' || field === 'precio' || field === 'iva') {
      const cantidad = parseFloat(newVentas[index].cantidad) || 0;
      const precio = parseFloat(newVentas[index].precio) || 0;
      const iva = newVentas[index].iva ? 1.10 : 1.00;
      newVentas[index].total = (cantidad * precio * iva).toFixed(2);
    }

    setVentas(newVentas);
  };

  const handleSelectProduct = (producto) => {
    const newVentas = [...ventas];
    newVentas[currentRowIndex] = {
      ...newVentas[currentRowIndex],
      id_producto: producto.id,
      nombre: producto.nombre,
      precio: producto.precio
    };

    // Recalcular el total
    const cantidad = parseFloat(newVentas[currentRowIndex].cantidad) || 0;
    const precio = parseFloat(producto.precio) || 0;
    const iva = newVentas[currentRowIndex].iva ? 1.10 : 1.00;
    newVentas[currentRowIndex].total = (cantidad * precio * iva).toFixed(2);

    setVentas(newVentas);
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Promise.all(ventas.map(async (venta) => {
        await axios.put(`/api/ventas/${venta.id}`, venta);
      }));
      toast.success("Ventas actualizadas con éxito");
      navigate('/principal/venta');
    } catch (error) {
      console.error("Error al actualizar las ventas:", error);
      toast.error("Error al actualizar las ventas");
    }
  };

  const openModal = (index) => {
    setCurrentRowIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toString().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        {" / "}
        <Link to="/principal/venta/edit" className="text-blue-500 hover:underline font-bold">
          EDITAR
        </Link>
      </div>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Editar Ventas</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="codigoVenta" className="font-bold">Código de Venta</label>
            <input type="number" id="codigoVenta" name="codigoVenta" className="p-2 border border-gray-300 rounded w-full" value={ventas[0]?.codigo || ''} disabled />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="fechaVenta" className="font-bold">Fecha de Venta</label>
            <input type="date" id="fechaVenta" name="fechaVenta" className="p-2 border border-gray-300 rounded w-full" value={ventas[0]?.fecha_venta ? new Date(ventas[0].fecha_venta).toISOString().split('T')[0] : ''} onChange={(e) => handleInputChange(0, 'fecha_venta', e.target.value)} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="cliente" className="font-bold">Cliente</label>
            <select id="cliente" name="cliente" className="p-2 border border-gray-300 rounded w-full" value={ventas[0]?.id_cliente || ''} onChange={(e) => handleInputChange(0, 'id_cliente', e.target.value)}>
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="border-collapse md:border-separate border border-blue-200 w-full bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black-200 px-4 py-2 w-10">Index</th>
              <th className="border border-black-200 px-4 py-2 w-30">Código</th>
              <th className="border border-black-200 px-4 py-2 " >Producto</th>
              <th className="border border-black-200 px-4 py-2 w-16">Cantidad</th>
              <th className="border border-black-200 px-4 py-2">IVA</th>
              <th className="border border-black-200 px-4 py-2 w-30">Precio</th>
              <th className="border border-black-200 px-4 py-2 w-30">Total</th>
              <th className="border border-black-200 px-4 py-2 w-10">Búsqueda</th>
              <th className="border border-black-200 px-4 py-2 w-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={venta.id}>
                <td className="border border-black-200 px-4 py-2">
                  <div className="flex justify-center">
                    {index + 1}
                  </div>
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <input type="text" id={`producto-${index}`} name="producto" className="p-2 border border-gray-300 rounded w-full" value={productos.find(producto => producto.id === venta.id_producto)?.codigo || ''} disabled />
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <input type="text" id={`producto-${index}`} name="producto" className="p-2 border border-gray-300 rounded w-full" value={productos.find(producto => producto.id === venta.id_producto)?.nombre || ''} disabled />
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <input type="number" id={`cantidad-${index}`} name="cantidad" className="p-1 border border-gray-300 w-16 text-center" value={venta.cantidad} onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)} />
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <div className="flex justify-center">
                    <input type="checkbox" id={`iva-${index}`} name="iva" className="p-1 border border-gray-300 rounded" checked={venta.iva} onChange={(e) => handleInputChange(index, 'iva', e.target.checked)} />
                  </div>
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <input type="number" id={`precio-${index}`} name="precio" autoComplete="price" className="p-1 border border-gray-300 w-20 text-center" value={venta.precio} onChange={(e) => handleInputChange(index, 'precio', e.target.value)} />
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <input type="number" id={`total-${index}`} name="total" autoComplete="price" className="p-1 border border-gray-300 w-20 text-center" value={venta.total} disabled />
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <div className="flex justify-center">
                    <button type="button" onClick={() => openModal(index)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                      <Search size={20} />
                    </button>
                  </div>
                </td>
                <td className="border border-black-200 px-4 py-2">
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleDeleteRow(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Guardar
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Buscar Producto"
        className="bg-white p-6 rounded-lg shadow-lg max-w-200 mx-auto"
        overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl mb-4">Buscar Producto</h2>
        <input
          type="text"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full mb-4"
        />
        <table className="border-collapse md:border-separate border border-blue-200 w-full bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black-200 px-4 py-2">Código</th>
              <th className="border border-black-200 px-4 py-2">Nombre</th>
              <th className="border border-black-200 px-4 py-2">Descripción</th>
              <th className="border border-black-200 px-4 py-2">Precio</th>
              <th className="border border-black-200 px-4 py-2">Stock</th>
              <th className="border border-black-200 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((producto) => (
              <tr key={producto.id}>
                <td className="border border-black-200 px-4 py-2">{producto.codigo}</td>
                <td className="border border-black-200 px-4 py-2">{producto.nombre}</td>
                <td className="border border-black-200 px-4 py-2">{producto.descripcion}</td>
                <td className="border border-black-200 px-4 py-2">{producto.precio}</td>
                <td className="border border-black-200 px-4 py-2">{producto.stock}</td>
                <td className="border border-black-200 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(producto)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredProductos.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Editventa;