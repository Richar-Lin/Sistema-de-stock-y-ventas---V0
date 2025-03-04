import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const LayoutPrincipal = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar la visibilidad del sidebar

    return (
        <div className="w-screen h-screen flex flex-col">
            {/* Header */}
            <Header className="bg-gray-900 text-white p-4" />

            {/* Contenedor principal con flexbox */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"}`}
                />

                {/* Contenido dinámico */}
                <main className={`flex-1 p-6 bg-gray-100 overflow-auto transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"}`}>
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <Footer className="bg-gray-900 text-white p-4" />
        </div>
    );
};



export default LayoutPrincipal;
