import imagen from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
 // const [username, setUsername] = useState('');
 // const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
   // e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    // Si la autenticación es exitosa, redirige a la página principal
    navigate('/principal');
  };

  return (

    <div className="shadow-lg px-5 py-12 rounded-xl bg-gray-100 w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center mb-10">
          <img src={imagen} className="w-40 h-40 rounded-full" />
        </div>
        <div className="mb-5 mx-10" >
          <label htmlFor="username" className="block text-gray-600 text-2xl font-bold mb-3 ">
            Usuario 👨‍💼:
          </label>
          <input
            type="text"
            id="username"
            autoComplete="current-username"
            placeholder="Ingrese su Usuario"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            required
          />
        </div>
        <div className="mb-10 mx-10">
          <label htmlFor="password" className="block text-gray-600 text-2xl font-bold mb-3">
            Password 🔒:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Ingrese su Contraseña"
            autoComplete="current-password"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="flex justify-center items-center"> 
          <button
            type="submit"
            className="w-auto bg-indigo-700 py-3 px-10 rounded-xl font-bold text-white hover:bg-indigo-800 transition duration-300 ease-in-out"
            
          >
            Iniciar Sesión
          </button>
        </div>

      </form>
    </div>
  )
}

export default Login