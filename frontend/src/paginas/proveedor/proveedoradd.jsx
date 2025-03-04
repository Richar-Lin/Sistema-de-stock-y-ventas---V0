import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ProveedorAdd = () => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const navigate = useNavigate();

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleTelefonoChange = (event) => {
    setTelefono(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const nuevoProveedor = {
        nombre,
        telefono: telefono || "sin teléfono",
        email: email || "sin email",
        direccion: direccion || "sin direccion"
      };
      await axios.post('/api/proveedores', nuevoProveedor);
      toast.success("Proveedor agregado con éxito");
      navigate('/principal/proveedor');
    } catch (error) {
      console.error("Error al agregar el proveedor:", error);
      toast.error("Error al agregar el proveedor");
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
        <Link to="/principal/proveedor" className="text-blue-500 hover:underline font-bold">
          PROVEEDOR
        </Link>
        {" / "}
        <Link to="/principal/proveedor/add" className="text-blue-500 hover:underline font-bold">
          AGREGAR
        </Link>
      </div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agregar Proveedor</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="nombre" className="font-bold">Nombre</label>
            <input required type="text" id="nombre" name="nombre" autoComplete="name" className="p-2 border border-gray-300 rounded w-full" value={nombre} onChange={handleNombreChange} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="telefono" className="font-bold">Teléfono</label>
            <input type="text" id="telefono" name="telefono" autoComplete="tel" className="p-2 border border-gray-300 rounded w-full" value={telefono} onChange={handleTelefonoChange} />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-bold">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" className="p-2 border border-gray-300 rounded w-full" value={email} onChange={handleEmailChange} />
          </div>
          <div className="flex flex-col space-y-2 pb-5">
            <label htmlFor="direccion" className="font-bold">Dirección</label>
            <input type="text" id="direccion" name="direccion" autoComplete="street-address" className="p-2 border border-gray-300 rounded w-full" value={direccion} onChange={handleDireccionChange} />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ProveedorAdd;