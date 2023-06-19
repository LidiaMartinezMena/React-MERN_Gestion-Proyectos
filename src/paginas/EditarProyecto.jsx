import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import FormularioProyecto from "../components/FormularioProyecto"


const EditarProyecto = () => {

    const params = useParams();

    const { obtenerProyecto, proyecto, cargando } = useProyectos()
  
  useEffect(() => {
    obtenerProyecto(params.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const { nombre } = proyecto

  if(cargando ) return 'Cargando...'

console.log(proyecto.nombre)
  return (
    <>
        <h1 className="font-black text-3xl">Editar Proyecto: {nombre} </h1>
        <div className="mt-10 flex justify-center">
          <FormularioProyecto />
        </div>
    </>
  )
}

export default EditarProyecto
