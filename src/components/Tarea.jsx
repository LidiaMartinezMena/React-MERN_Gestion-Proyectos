import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"

const Tarea = ({tarea}) => {

    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea  } = useProyectos();

    const { descripcion, nombre, prioridad, fechaEntrega, _id, estado } = tarea

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p className="mb-2 text-xl">{nombre}</p>
            <p className="mb-2 text-sm text-gray-500">{descripcion}</p>
            <p className="mb-2 text-sm">{formatearFecha(fechaEntrega)}</p>
            <p className="mb-2 text-gray-600">Prioridad: {prioridad}</p>
        </div>
        <div className="flex gap-2">
            <button
               className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
               onClick={() => handleModalEditarTarea(tarea)} 
            >Editar</button> 
           
            <button
                className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`} 
                onClick={() => completarTarea(_id)}
                >{estado ? 'Completa' : 'Incompleta'}</button> 
            
             
            <button
               className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" 
               onClick={() => handleModalEliminarTarea(tarea)}
            >Eliminar</button> 
        </div>
    </div>
  )
}

export default Tarea
