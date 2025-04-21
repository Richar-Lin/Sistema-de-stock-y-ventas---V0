import { useState, useEffect } from "react";
import { Search, Plus, Trash } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddCompra = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [rows, setRows] = useState([
    { codigo: "", nombre: "", cantidad: "", iva: false, precio: "", subtotal: "" }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [codigoCompra, setCodigoCompra] = useState("");
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split('T')[0]); // Fecha actual
  const [total, setTotal] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los productos desde el backend
    const fetchProductos = async () => {
      try {
        const response = await axios.get('/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    // Obtener los proveedores desde el backend
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    // Obtener el último código de compra desde el backend
    const fetchUltimoCodigoCompra = async () => {
      try {
        const response = await axios.get('/api/compras/ultimoId');
        setCodigoCompra(response.data.ultimoCodigo + 1);
      } catch (error) {
        console.error("Error al obtener el último código de compra:", error);
      }
    };

    fetchProductos();
    fetchProveedores();
    fetchUltimoCodigoCompra();
  }, []);

  const handleProveedorChange = (event) => {
    setSelectedProveedor(event.target.value);
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    if (field === 'cantidad' || field === 'precio' || field === 'iva') {
      const cantidad = parseFloat(newRows[index].cantidad) || 0;
      const precio = parseFloat(newRows[index].precio) || 0;
      const iva = newRows[index].iva ? 1.10 : 1.00;
      newRows[index].subtotal = (cantidad * precio * iva).toFixed(2);
    }

    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { codigo: "", nombre: "", cantidad: "", iva: false, precio: "", subtotal: "" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
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

  const handleSelectProduct = (producto) => {
    const newRows = [...rows];
    newRows[currentRowIndex] = {
      ...newRows[currentRowIndex],
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio
    };

    // Recalcular el subtotal
    const cantidad = parseFloat(newRows[currentRowIndex].cantidad) || 0;
    const precio = parseFloat(producto.precio) || 0;
    const iva = newRows[currentRowIndex].iva ? 1.10 : 1.00;
    newRows[currentRowIndex].subtotal = (cantidad * precio * iva).toFixed(2);

    setRows(newRows);
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const nuevaCompra = {
        usuario: localStorage.getItem('id'),
        codigoCompra,
        fechaCompra,
        total,
        id_proveedor: selectedProveedor,
        productos: rows.map(row => ({
          ...row,
          iva: row.iva ? 1 : 0 // Convertir iva a 1 si es true, 0 si es false
        })),
      };

      console.log("Nueva compra a enviar:", nuevaCompra); // Verificar el objeto antes de enviarlo

      // Enviar la nueva compra al backend
      await axios.post('/api/compras', nuevaCompra);
      toast.success("Compra agregada con éxito");
      navigate('/principal/compra');
    } catch (error) {
      console.error("Error al agregar la compra:", error);
      toast.error("Error al agregar la compra");
    }
  };

  // Calcular el total dinámicamente
  useEffect(() => {
    const nuevoTotal = rows.reduce((acc, row) => acc + parseFloat(row.subtotal || 0), 0);
    setTotal(nuevoTotal.toFixed(2)); // Redondear a 2 decimales
  }, [rows]);

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
        <Link to="/principal/compra/add" className="text-blue-500 hover:underline font-bold">
          AGREGAR
        </Link>
      </div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agregar Compra</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="codigoCompra" className="font-bold">Código de Compra</label>
            <input type="number" id="codigoCompra" name="codigoCompra" className="p-2 border border-gray-300 rounded w-full" value={codigoCompra} disabled />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="fechaCompra" className="font-bold">Fecha de Compra</label>
            <input type="date" id="fechaCompra" name="fechaCompra" className="p-2 border border-gray-300 rounded w-full" value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="proveedor" className="font-bold">Proveedor</label>
            <select id="proveedor" name="proveedor" className="p-2 border border-gray-300 rounded w-full" value={selectedProveedor} onChange={handleProveedorChange}>
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="border-collapse md:border-separate border border-blue-200 w-full bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black-200 px-4 py-2 w-10">Index</th>
                  <th className="border border-black-200 px-4 py-2 w-20">Código</th>
                  <th className="border border-black-200 px-4 py-2 w-full">Producto</th>
                  <th className="border border-black-200 px-4 py-2 w-16">Cantidad</th>
                  <th className="border border-black-200 px-4 py-2">IVA</th>
                  <th className="border border-black-200 px-4 py-2 w-30">Precio</th>
                  <th className="border border-black-200 px-4 py-2 w-30">Subtotal</th>
                  <th className="border border-black-200 px-4 py-2 w-10">Búsqueda</th>
                  <th className="border border-black-200 px-4 py-2 w-10">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-black-200 px-4 py-2">
                      <div className="flex justify-center">
                        {index + 1}
                      </div>
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <input type="text" id={`codigo-${index}`} name="codigo" className="p-1 border border-gray-300 w-20 text-center" value={row.codigo} disabled />
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <input type="text" id={`nombre-${index}`} name="nombre" className="p-1 border border-gray-300 w-full" value={row.nombre} disabled />
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <input type="number" id={`cantidad-${index}`} name="cantidad" className="p-1 border border-gray-300 w-16 text-center" value={row.cantidad} onChange={(e) => handleRowChange(index, 'cantidad', e.target.value)} />
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <div className="flex justify-center">
                        <input type="checkbox" id={`iva-${index}`} name="iva" className="p-1 border border-gray-300 rounded" checked={row.iva} onChange={(e) => handleRowChange(index, 'iva', e.target.checked)} />
                      </div>
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <input type="number" id={`precio-${index}`} name="precio" autoComplete="price" className="p-1 border border-gray-300 w-20 text-center" value={row.precio} onChange={(e) => handleRowChange(index, 'precio', e.target.value)} />
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <input type="number" id={`subtotal-${index}`} name="subtotal" autoComplete="price" className="p-1 border border-gray-300 w-20 text-center" value={row.subtotal} disabled />
                    </td>
                    <td className="border border-black-200 px-4 py-2">
                      <div className="flex justify-center">
                        <button type="button" onClick={() => openModal(index)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                          <Search size={20} />
                        </button>
                      </div>
                    </td>
                    <td className="border border-black-200 px-4 py-2 w-40">
                      <div className="flex justify-center">
                        {index === 0 ? (
                          <button type="button" onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                            <Plus size={20} />
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleRemoveRow(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                            <Trash size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="Total" className="font-bold">Total de Compra</label>
            <input type="number" id="Total" name="Total" className="p-2 border border-gray-300 rounded w-full" value={total} disabled />
          </div>
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

export default AddCompra;