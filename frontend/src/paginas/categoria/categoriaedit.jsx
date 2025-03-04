
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Categoriaedit = () => {
    const [nombre, setNombre] = useState("");
    const { id } = useParams(); // Obtener el ID de la categoria desde los parámetros de la URL
    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener los categorias desde la API usando axios
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`/api/categorias/${id}`);
                const categoria = response.data;
                setNombre(categoria.nombre);
            } catch (error) {
                console.error("Error al obtener las categorias:", error);
            }
        };

        fetchCategorias();
    }, [id]);


    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedCategorias = {
                nombre,
            };
            await axios.put(`/api/categorias/${id}`, updatedCategorias);
            toast.success("Categoria actualizado con éxito");
            navigate('/principal/categoria');
        } catch (error) {
            console.error("Error al actualizar la categoria:", error);
            toast.error("Error al actualizar la categoria");
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
                <Link to="/principal/categoria/edit" className="text-blue-500 hover:underline font-bold">
                    EDITAR
                </Link>
            </div>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Editar Categoria</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="nombre" className="font-bold">Nombre</label>
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

export default Categoriaedit;

