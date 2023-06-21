import { useState, useEffect, createContext, Children } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos ] = useState([]);
    const [alerta, setAlerta ] = useState({});
    const [proyecto, setProyecto ] = useState({});
    const [cargando, setCargando ] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [tarea, setTarea ] = useState({});
    const [colaborador, setColaborador ] = useState({});
    const [buscador, setBuscador ] = useState(false);

    const navigate = useNavigate();
    const { auth } = useAuth()

    useEffect (() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.get('/proyectos', config)
            setProyectos(data);

            } catch (error) {
                console.log(error)
            }

        }
        obtenerProyectos();
    }, [auth])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    //Creamos los proyectos
    const submitProyecto = async proyecto => {

        if(proyecto.id){
            await editarProyecto(proyecto)
        }else {
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
                //Sincronizar el State: 
                const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
                setProyectos(proyectosActualizados)

                //Mostrar la alerta:
                setAlerta({
                    msg: "Proyecto actualizado correctamente",
                    error: false
                   })
                //Redireccionar:
                   setTimeout(() => {
                    setAlerta({})
                    navigate('/proyectos');
                   }, 2000);

                

        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos, data])

            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false
               })

               setTimeout(() => {
                setAlerta({})
                navigate('/proyectos');
               }, 2000);

        } catch (error) {
           console.log(error) 
          
        }
    }

    //Desarrollando el proyecto a mostrar:
    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.get(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})

        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error:true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            //Sincronizar el State: 
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

             //Mostrar la alerta:
            setAlerta({
                msg: data.msg,
                error: false
               })
            //Redireccionar:
               setTimeout(() => {
                setAlerta({})
                navigate('/proyectos');
               }, 2000);

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {
        if(tarea?.id){
           await editarTarea(tarea)
        }else {
           await crearTarea(tarea)
        }
    }
    const crearTarea = async tarea => {
        try {
            
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config)

            // Agrega la tarea al State y que se muestre:
            const proyectoActualizado = {...proyecto }
            proyectoActualizado.tareas = [...proyecto.tareas, data]

            setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormularioTarea(false)

    } catch (error) {
        console.log(error)
    }
}

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
//Hacemos copia del proyecto y creamos variable temporal: tareaState
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
                tareaState._id === data._id ? data : tareaState)
            setProyecto(proyectoActualizado)

            setAlerta({})
            setModalFormularioTarea(false)

        } catch (error) {
            console.log(error)  
        }
    }

    //COLABORADORES:

    const submitColaborador = async email => {
        setCargando(true)

        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({ })

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 2000);


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)
            
            const proyectoActualizado =  {...proyecto}

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter
            // eslint-disable-next-line no-unexpected-multiline
            (colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false  
            })
   
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 2000);

        } catch (error) {
            console.log(error.response)
        }
    }

    //TAREAS:

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            //Hacemos copia del proyecto y creamos variable temporal: tareaState
            const proyectoActualizado = {...proyecto}
           proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
            setProyecto(proyectoActualizado)

            
            setModalEliminarTarea(false)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            },2000 )

        } catch (error) {
            console.log(error)
        }
    }

    //CAMBIAR ESTADO DE UNA TAREA:

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)

            setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

        } catch (error) {
            console.log(error.response)
        }
    }

//BUSCADOR DE PROYECTOS:
    const handleBuscador = () => {
        setBuscador(!buscador)
    }

  //CERRAR SESIÓN:
  
  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto, 
                obtenerProyecto, 
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                submitColaborador,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                cerrarSesionProyectos
            }}
        >

            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext;