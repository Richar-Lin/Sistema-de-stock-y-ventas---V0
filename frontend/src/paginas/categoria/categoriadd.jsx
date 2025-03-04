

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Categoriadd = () => {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const nuevaCategoria = {
        nombre,
      };
      await axios.post('/api/categorias', nuevaCategoria);
      toast.success("Categoria agregada con éxito");
      navigate('/principal/categoria');
    } catch (error) {
      console.error("Error al agregar la categoria:", error);
      toast.error("Error al agregar la categoria");
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
        <Link to="/principal/categoria" className="text-blue-500 hover:underline font-bold">
          CATEGORIA
        </Link>
        {" / "}
        <Link to="/principal/categoria/add" className="text-blue-500 hover:underline font-bold">
          AGREGAR
        </Link>
      </div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agregar Categoria</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="nombre" className="font-bold">Nombre de la Categoria</label>
            <input required type="text" id="nombre" name="nombre" autoComplete="name" className="p-2 border border-gray-300 rounded w-full" value={nombre} onChange={handleNombreChange} />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default Categoriadd;
