
import { ShoppingCart, Box, Factory, Users, Tags, User, Home, Menu, X, Store } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <div className={`transition-all duration-300 ${isOpen ? "w-64" : "0"} bg-gray-800 text-white`}>
            {/* Botón de toggle */}
            <div className="flex items-center justify-between mb-4">
                {/* El título "Menú" se oculta cuando el sidebar está cerrado */}
                <h2 className={`text-3xl font-semibold p-2 ml-3 ${isOpen ? "block" : "hidden"} `}>Menú</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-gray-800 text-white rounded-lg focus:outline-none hover:bg-gray-700 transition"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}

                </button>
            </div>


            {/* Contenido del sidebar */}
            <ul className={`space-y-3 ${isOpen ? "block" : "hidden"}`}>
                {/* Aquí van los enlaces del sidebar */}
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <Home size={35} className="pl-3"/>
                    <Link to="/principal" className="flex items-center space-x-2 p-2 w-full rounded ">Inicio</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <ShoppingCart size={35}  className="pl-3"/>
                    <Link to="/principal/venta" className="flex items-center space-x-2 p-2 w-full rounded ">Venta</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <Store size={35}  className="pl-3"/>
                    <Link to="/principal/compra" className="flex items-center space-x-2 p-2 w-full rounded ">Compra</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <Box size={35}  className="pl-3"/>
                    <Link to="/principal/producto" className="flex items-center space-x-2 p-2 w-full rounded">Producto</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <Factory size={35}  className="pl-3"/>
                    <Link to="/principal/proveedor" className="flex items-center space-x-2 p-2 w-full rounded">Proveedor</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <Users size={35}  className="pl-3"/>
                    <Link to="/principal/cliente" className="flex items-center space-x-2 p-2 w-full rounded">Cliente</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <Tags size={35}  className="pl-3 "/>
                    <Link to="/principal/categoria" className="flex items-center space-x-2 p-2 w-full rounded ">Categoría</Link>
                </li>
                <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400">
                    <User size={35}  className="pl-3"/>
                    <Link to="/principal/usuario" className="flex items-center space-x-2 p-2 w-full rounded">Usuario</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

