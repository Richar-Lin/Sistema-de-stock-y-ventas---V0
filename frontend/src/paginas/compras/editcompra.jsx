import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Search, Plus, Trash } from "lucide-react";
import Modal from "react-modal";

const EditCompra = () => {
  const { id } = useParams();
  const [compra, setCompra] = useState([]);
  const [d_compras, setD_compras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await axios.get(`/api/compras/${id}`);
        setCompra(response.data);
      } catch (error) {
        console.error("Error al obtener la compra:", error);
      }
    };

    const fetchD_compras = async () => {
      try {
        const response = await axios.get(`/api/compras/d_compra/${id}`);
        setD_compras(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la compra:", error);
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await axios.get('/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
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

    fetchCompra();
    fetchD_compras();
    fetchProveedores();
    fetchProductos();
  }, [id]);

  const handleInputChange = (index, field, value) => {
    const newD_compras = [...d_compras];
    newD_compras[index][field] = value;

    if (field === 'cantidad' || field === 'precio' || field === 'iva') {
      const cantidad = parseFloat(newD_compras[index].cantidad) || 0;
      const precio = parseFloat(newD_compras[index].precio) || 0;
      const iva = newD_compras[index].iva ? 1.10 : 1.00;
      newD_compras[index].subtotal = (cantidad * precio * iva).toFixed(2);
    }

    setD_compras(newD_compras);
  };

  const handleSelectProduct = (producto) => {
    const newD_compras = [...d_compras];
    newD_compras[currentRowIndex] = {
      ...newD_compras[currentRowIndex],
      id_producto: producto.id,
      nombre: producto.nombre,
      precio: producto.precio
    };

    // Recalcular el subtotal
    const cantidad = parseFloat(newD_compras[currentRowIndex].cantidad) || 0;
    const precio = parseFloat(producto.precio) || 0;
    const iva = newD_compras[currentRowIndex].iva ? 1.10 : 1.00;
    newD_compras[currentRowIndex].subtotal = (cantidad * precio * iva).toFixed(2);

    setD_compras(newD_compras);
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Enviar compra y d_compras en un solo PUT
      await axios.put(`/api/compras/${id}`, {
        compra,
        detalles: d_compras, // Enviar los detalles como parte del cuerpo
      });

      toast.success("Compra actualizada con éxito");
      navigate('/principal/compra');
    } catch (error) {
      console.error("Error al actualizar la compra:", error);
      toast.error("Error al actualizar la compra");
    }
  };

  const handleAddRow = () => {
    setD_compras([...d_compras, { codigo: "", nombre: "", cantidad: "", iva: false, precio: "", subtotal: "" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = d_compras.filter((_, i) => i !== index);
    setD_compras(newRows);
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

  // Calcular el total dinámicamente
  useEffect(() => {
    const nuevoTotal = d_compras.reduce((acc, d_compra) => acc + parseFloat(d_compra.subtotal || 0), 0);
    setCompra((prevCompra) => ({
      ...prevCompra,
      total: nuevoTotal.toFixed(2), // Redondear a 2 decimales
    }));
  }, [d_compras]);

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
        <Link to="/principal/compra" className="text-blue-500 hover:underline font-bold">
          COMPRA
        </Link>
        {" / "}
        <Link to="/principal/compra/edit" className="text-blue-500 hover:underline font-bold">
          EDITAR
        </Link>
      </div>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Editar Compra</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="codigoCompra" className="font-bold">Código de Compra</label>
            <input type="number" id="codigoCompra" name="codigoCompra" className="p-2 border border-gray-300 rounded w-full" value={compra.codigo || ''} disabled />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="fechaCompra" className="font-bold">Fecha de Compra</label>
            <input type="date" id="fechaCompra" name="fechaCompra" className="p-2 border border-gray-300 rounded w-full" value={compra.fecha ? new Date(compra.fecha).toISOString().split('T')[0] : ''} onChange={(e) => setCompra({ ...compra, fecha: e.target.value })} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="proveedor" className="font-bold">Proveedor</label>
            <select id="proveedor" name="proveedor" className="p-2 border border-gray-300 rounded w-full" value={compra.id_proveedor || ''} onChange={(e) => setCompra({ ...compra, id_proveedor: e.target.value })}>
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse md:border-separate border border-blue-200 w-full bg-white shadow-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black-200 px-4 py-2 w-10">Index</th>
                <th className="border border-black-200 px-4 py-2 w-30">Código</th>
                <th className="border border-black-200 px-4 py-2">Producto</th>
                <th className="border border-black-200 px-4 py-2 w-16">Cantidad</th>
                <th className="border border-black-200 px-4 py-2">IVA</th>
                <th className="border border-black-200 px-4 py-2 w-30">Precio</th>
                <th className="border border-black-200 px-4 py-2 w-30">Subtotal</th>
                <th className="border border-black-200 px-4 py-2 w-10">Búsqueda</th>
                <th className="border border-black-200 px-4 py-2 w-10">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {d_compras.map((detalle, index) => (
                <tr key={detalle.id}>
                  <td className="border border-black-200 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-black-200 px-4 py-2">{productos.find(producto => producto.id === detalle.id_producto)?.codigo || ''}</td>
                  <td className="border border-black-200 px-4 py-2">{productos.find(producto => producto.id === detalle.id_producto)?.nombre || ''}</td>
                  <td className="border border-black-200 px-4 py-2">
                    <input type="number" className="p-1 border border-gray-300 w-16 text-center" value={detalle.cantidad} onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)} />
                  </td>
                  <td className="border border-black-200 px-4 py-2 text-center">
                    <input type="checkbox" checked={detalle.iva} onChange={(e) => handleInputChange(index, 'iva', e.target.checked)} />
                  </td>
                  <td className="border border-black-200 px-4 py-2 text-center">{detalle.precio}</td>
                  <td className="border border-black-200 px-4 py-2 text-center">{detalle.subtotal}</td>
                  <td className="border border-black-200 px-4 py-2">
                    <div className="flex justify-center">
                      <button type="button" onClick={() => openModal(index)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        <Search size={20} />
                      </button>
                    </div>
                  </td>
                  <td className="border border-black-200 px-4 py-2 w-40">
                    <div className="flex justify-between">
                      <button type="button" onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        <Plus size={20} />
                      </button>
                      <button type="button" onClick={() => handleRemoveRow(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="Total" className="font-bold">Total de Compra</label>
          <input type="number" id="Total" name="Total" className="p-2 border border-gray-300 rounded w-full" value={compra.total || 0} disabled />
        </div>
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

export default EditCompra;