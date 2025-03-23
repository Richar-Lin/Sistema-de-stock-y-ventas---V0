import { useState, useEffect } from "react";
import axios from "axios";
import { AgCharts } from "ag-charts-react";

const ChartVentasB = () => {
    const [options, setOptions] = useState({
        title: {
            text: "Ventas Totales por Usuario en el Año",
        },
        data: [], // Inicialmente vacío, se llenará con los datos de la API
        series: [
            {
                type: "bar",
                xKey: "usuario", // El eje X representará a los usuarios
                yKey: "total", // El eje Y mostrará el total de ventas
                yName: "Ventas Totales", // Nombre de la serie
            },
        ],
        axes: [
            {
                type: "category",
                position: "bottom",
                title: { text: "Usuarios" },
            },
            {
                type: "number",
                position: "left",
                title: { text: "Total de Ganancia" },
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/ventas");
                const ventas = response.data;

                // Obtener los usuarios
                const usuariosResponse = await axios.get("/api/usuarios");
                const usuarios = usuariosResponse.data;


                // Crear un mapa de ID de usuario a nombre de usuario
                const usuarioMap = {};
                usuarios.forEach((usuario) => {
                    usuarioMap[usuario.id] = usuario.nombre_usuario;
                });

                // Agrupar los datos por usuario y sumar los totales
                const dataByUsuario = {};
                ventas.forEach((venta) => {
                    const usuario = usuarioMap[venta.id_usuario]; // Usar el nombre del usuario desde usuarioMap
                    if (!usuario) {
                        console.error(`No se encontró el usuario con ID: ${venta.id_usuario}`);
                        return; // Saltar esta iteración si el usuario no existe
                    }
                    if (!dataByUsuario[usuario]) {
                        dataByUsuario[usuario] = { usuario, total: 0 };
                    }
                    dataByUsuario[usuario].total += parseFloat(venta.total); // Sumar el total de ventas
                });

                // Convertir el objeto en un array para el gráfico
                const transformedData = Object.values(dataByUsuario);
               

                // Actualizar las opciones del gráfico
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    data: transformedData,
                }));
            } catch (error) {
                console.error("Error al obtener los datos de ventas:", error);
            }
        };

        fetchData();
    }, []);

    return <AgCharts options={options} />;
};

export default ChartVentasB;