import { Outlet } from "react-router-dom"


const AuthLayout = () => {
  return (
    <main className="container mx-auto flex items-center justify-center min-h-screen p-4 md:p-8">
      <Outlet />
    </main>
  )
}


export default AuthLayout