import { LucideUser } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";


const Header = () => {
    const id = localStorage.getItem("id");
    const [userName, setUserName] = useState("");
    const [showMenu, setShowMenu] = useState(false); // Estado para mostrar/ocultar el menú

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`/api/usuarios/${id}`);
                setUserName(response.data.nombre_usuario);
            } catch (error) {
                console.error("Error al obtener la venta:", error);
            }
        };
        fetchUsuario();
    }, []);

    const handleLogout = () => {
        // Eliminar datos del usuario de localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("id");

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = "/";
    };

    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md pr-10">
            <h1 className="text-3xl font-bold ml-5">Aurora</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li className="relative">
                        {/* Botón para abrir/cerrar el menú */}

                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="hover:text-blue-400  hover:bg-gray-700 focus:outline-none border border-white rounded-full px-7 py-2 flex items-center"
                        >
                            <LucideUser size={24} className="mr-5" />
                            {userName || "Cargando..."}
                        </button>


                        {/* Menú desplegable */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-45 bg-gray-800 text-white rounded shadow-lg  hover:bg-gray-700 hover:text-blue-400">
                                <ul>
                                    <li className="px-4 py-2 cursor-pointer">
                                        <button onClick={handleLogout} className="w-full text-left">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;