import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthLayout from "./layout/Authlayout"
import LayoutPrincipal from "./layout/LayoutPrincipal"
import Login from "./paginas/Login"
import Registrar from "./paginas/usuario/Addusu"
import Principal from "./paginas/principal"
import Usuario from "./paginas/usuario/usuario"
import Editusu from "./paginas/usuario/editusu"
import Proveedor from "./paginas/proveedor/proveedor"
import Proveedoradd from "./paginas/proveedor/proveedorAdd"
import Proveedoredit from "./paginas/proveedor/proveedorEdit"
import Categoria from "./paginas/categoria/categoria"
import Categoriadd from "./paginas/categoria/categoriadd"
import Categoriaedit from "./paginas/categoria/categoriaedit"
import Cliente from "./paginas/clientes/clientes"
import ClienteAdd from "./paginas/clientes/clientesadd"
import Clientedit from "./paginas/clientes/clientesedit"
import Producto from "./paginas/producto/producto"
import Productoadd from "./paginas/producto/addproducto"
import Editproducto from "./paginas/producto/editproducto"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/principal" element={<LayoutPrincipal />}>
          <Route index element={<Principal />} />
          <Route path="usuario" element={<Usuario />} />
          <Route path="usuario/add" element={<Registrar />} />
          <Route path="usuario/edit/:id" element={<Editusu />} />
          <Route path="proveedor" element={<Proveedor />} />
          <Route path="proveedor/add" element={< Proveedoradd/>}/>
          <Route path="proveedor/edit/:id" element={< Proveedoredit/>} />
          <Route path="categoria" element={<Categoria />} />
          <Route path="categoria/add" element={<Categoriadd />} />
          <Route path="categoria/edit/:id" element={<Categoriaedit />} />
          <Route path="cliente" element={<Cliente />} />
          <Route path="cliente/add" element={<ClienteAdd />} />
          <Route path="cliente/edit/:id" element={<Clientedit />} />
          <Route path="producto" element={<Producto />} />
          <Route path="producto/add" element={<Productoadd />} />
          <Route path="producto/edit/:id" element={<Editproducto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
