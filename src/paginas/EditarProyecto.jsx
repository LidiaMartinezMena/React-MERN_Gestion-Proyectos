import useProyectos from "../hooks/useProyectos"




const EditarProyecto = () => {

    const { proyecto } = useProyectos()
console.log(proyecto.nombre)
  return (
    <div>
      Editar Proyecto: {proyecto.nombre}
    </div>
  )
}

export default EditarProyecto
