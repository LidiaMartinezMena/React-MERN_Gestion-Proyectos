import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

import useAuth from "../hooks/useAuth"

const Login = (  ) => {

    const [ email, setEmail] = useState('')
    const [ password, setPassword] = useState('')
    const [ alerta, setAlerta] = useState({})

    const {  setAuth } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error:true
              });
              return
        }
        try {
            
            const { data } = await clienteAxios.post('/usuarios/login', {email, password});
            setAlerta({})

            navigate('/proyectos')
            localStorage.setItem('token', data.token)
            setAuth(data)
        } catch (error) {
            setAlerta({
              msg: error.response.data.msg,
              error:true
            })
        }
    }

    const { msg } = alerta

  return (
    <>
        <h1 className="text-sky-700 font-black text-5xl capitalize"> Inicia sesión y administra tus  {""}
            <span className="text-slate-700">Proyectos</span> 
        </h1>

        {msg && <Alerta alerta={alerta} />}

        <form 
            className="my-10 bg-white shadow rounded-lg px10 py-10"
            onSubmit={handleSubmit}
            >
            <div className="my-5 ">
                <label 
                    className="uppercase text-gray-600 block text-l font-bold"
                    htmlFor="email"
                >Email</label>
                <input 
                    id="email"
                    type="email"
                    placeholder="Email de Registro"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="my-5 ">
                <label 
                    className="uppercase text-gray-600 block text-l font-bold"
                    htmlFor="password"
                >Password</label>
                <input 
                    id="password"
                    type="password"
                    placeholder="Password de Registro"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-200"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <input 
                type="submit"
                value="Iniciar sesión"
                className="bg-sky-600 mb-5 w-full py-3 text-white uppercase font-bold rounded-xl 
                hover:cursor-pointer hover:bg-sky-900 transition-colors"
            />
        </form>
        <nav className="lg:flex lg:justify-between">
            <Link
                to="/registrar"
                className="block text-center my-5 text-slate-500 uppercase text-sm"
            >¿No tienes cuenta? Regístrate </Link>
            <Link
                to="/olvide-password"
                className="block text-center my-5 text-slate-500 uppercase text-sm"
            >Olvidé mi password </Link>
        </nav>
    </>
  )
}

export default Login
