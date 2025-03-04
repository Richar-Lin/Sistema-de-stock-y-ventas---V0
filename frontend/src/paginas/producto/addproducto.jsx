import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Productoadd = () => {
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener las categorías desde el backend
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('/api/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
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

    fetchCategorias();
    fetchProveedores();
  }, []);

  const handleCategoriaChange = (event) => {
    setSelectedCategoria(event.target.value);
  };

  const handleProveedorChange = (event) => {
    setSelectedProveedor(event.target.value);
  };

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handlePrecioChange = (event) => {
    setPrecio(event.target.value);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const nuevoProducto = {
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria: selectedCategoria,
        id_proveedor: selectedProveedor
      };
      await axios.post('/api/productos', nuevoProducto);
      toast.success("Producto agregado con éxito");
      navigate('/principal/producto');
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      toast.error("Error al agregar el producto");
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
        <Link to="/principal/producto" className="text-blue-500 hover:underline font-bold">
          PRODUCTO
        </Link>
        {" / "}
        <Link to="/principal/producto/add" className="text-blue-500 hover:underline font-bold">
          AGREGAR
        </Link>
      </div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agregar Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="nombre" className="font-bold">Nombre</label>
            <input type="text" id="nombre" name="nombre" autoComplete="name" className="p-2 border border-gray-300 rounded w-full" value={nombre} onChange={handleNombreChange} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="descripcion" className="font-bold">Descripción</label>
            <input type="text" id="descripcion" name="descripcion" autoComplete="description" className="p-2 border border-gray-300 rounded w-full" value={descripcion} onChange={handleDescripcionChange} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="precio" className="font-bold">Precio</label>
            <input type="number" id="precio" name="precio" autoComplete="price" className="p-2 border border-gray-300 rounded w-full" value={precio} onChange={handlePrecioChange} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="stock" className="font-bold">Stock</label>
            <input type="number" id="stock" name="stock" autoComplete="stock" className="p-2 border border-gray-300 rounded w-full" value={stock} onChange={handleStockChange} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="categoria" className="font-bold">Categoría</label>
            <select id="categoria" name="categoria" className="p-2 border border-gray-300 rounded w-full" value={selectedCategoria} onChange={handleCategoriaChange}>
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2 pb-5">
            <label htmlFor="proveedor" className="font-bold">Proveedor</label>
            <select id="proveedor" name="proveedor" className="p-2 border border-gray-300 rounded w-full" value={selectedProveedor} onChange={handleProveedorChange}>
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
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

export default Productoadd;