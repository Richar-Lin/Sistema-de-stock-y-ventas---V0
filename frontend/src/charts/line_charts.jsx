import { useState, useEffect } from "react";
import axios from "axios";
import { AgCharts } from "ag-charts-react";

const ChartVentas = () => {
    const [options, setOptions] = useState({
        title: {
            text: "Ventas Totales por Fecha",
        },
        data: [], // Inicialmente vacío, se llenará con los datos de la API
        series: [], // Inicialmente vacío, se llenará dinámicamente con las series por usuario
        axes: [
            {
                type: "category",
                position: "bottom",
            
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
                const usuarios2 = usuariosResponse.data;

                // Crear un mapa de ID de usuario a nombre de usuario
                const usuarioMap = {};
                usuarios2.forEach((usuario) => {
                    usuarioMap[usuario.id] = usuario.nombre_usuario;
                });

                // Formatear los datos para agrupar por mes y usuario
                const formattedData = ventas.map((venta) => ({
                    fecha: new Date(venta.fecha_venta).toLocaleDateString("es-ES", { year: "numeric", month: "short" }), // Agrupar por mes y año
                    total: parseFloat(venta.total), // Asegúrate de que el total sea un número
                    usuario: usuarioMap[venta.id_usuario], // Usar el nombre del usuario desde usuarioMap
                }));

                // Obtener usuarios únicos
                const usuarios = [...new Set(formattedData.map((venta) => venta.usuario))];

                // Crear una estructura para agrupar los datos por mes
                const dataByFecha = {};
                formattedData.forEach((venta) => {
                    const key = venta.fecha; // Clave basada en el mes
                    if (!dataByFecha[key]) {
                        dataByFecha[key] = { fecha: venta.fecha }; // Inicializar el objeto para este mes
                    }
                    // Sumar los totales para cada usuario
                    dataByFecha[key][`total_${venta.usuario}`] =
                        (dataByFecha[key][`total_${venta.usuario}`] || 0) + venta.total;
                });

                // Convertir el objeto en un array para el gráfico
                const transformedData = Object.values(dataByFecha);

                // Crear una serie para cada usuario
                const series = usuarios.map((usuario) => ({
                    type: "line",
                    xKey: "fecha",
                    yKey: `total_${usuario}`, // Clave única para cada usuario
                    yName: `Usuario ${usuario}`, // Nombre de la serie
                }));

                // Actualizar las opciones del gráfico
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    data: transformedData,
                    series: series,
                }));
            } catch (error) {
                console.error("Error al obtener los datos de ventas:", error);
            }
        };

        fetchData();
    }, []);

    return <AgCharts options={options} />;
};

export default ChartVentas;