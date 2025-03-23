import ChartVentas from "../charts/line_charts";
import ChartVentasB from "../charts/bar_charts";

const Principal = () => {
  return (
    <main className="container h-full w-full mx-auto p-4 m-4 bg-white shadow-lg rounded-lg">
      <div>
        <h1 className="text-3xl"><strong>¡Bienvenido a la página principal!</strong></h1>
        <p className="text-lg">Aquí podrás ver un resumen de las ventas y productos de la tienda.</p>
      </div>

      <div className="mt-10 w-full p-4 flex-1 mx-auto">
        <ChartVentas />
      </div>

      <div className="mt-10 w-full p-4 flex-1 mx-auto">
        <ChartVentasB />
      </div>

    </main>
  )
}

export default Principal;