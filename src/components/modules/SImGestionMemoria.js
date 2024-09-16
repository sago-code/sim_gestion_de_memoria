import React, { Fragment, useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import '../styles/SimGestionMemoria.css';
import papeleraNegra from '../../images/papelera.png';
import axios from 'axios';

Modal.setAppElement('#root');

export function SimGestionMemoria() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isParticionesModalOpen, setIsParticionesModalOpen] = useState(false);
    const [ajustes, setAjustes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAjuste, setSelectedAjuste] = useState(null);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [particiones, setParticiones] = useState([]);
    const [procesos, setProcesos] = useState([]);
    const [colaProcesos, setColaProcesos] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [unidadMedida, setUnidadMedida] = useState('');
    const [prioridad, setPrioridad] = useState(1);
    const [prioridadP, setPrioridadP] = useState(1);

    const tamañoRef = useRef(null);
    const nombreProcesoRef = useRef(null);
    const tamañoProcesoRef = useRef(null);
    const unidadMedidaRef = useRef(null);
    

    const convertirABytes = (tamaño, unidad) => {
        const conversiones = {
            'B': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024
        };
    
        return tamaño * (conversiones[unidad] || 1);
    };

    const convertirDeBytes = (bytes, unidad) => {
        const conversiones = {
            'B': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024
        };
        return bytes / (conversiones[unidad] || 1);
    };

    const agregarParticion = () => {
        const tamaño = tamañoRef.current.value;
        const unidadMedida = unidadMedidaRef.current.value;

        if (tamaño && unidadMedida && selectedAjuste) {
            const tamañoNumerico = parseInt(tamaño, 10);
            if (isNaN(tamañoNumerico) || tamañoNumerico <= 0) {
                setError("El tamaño debe ser un número positivo.");
                return;
            }

            const nuevaParticion = {
                tamaño: tamañoNumerico,
                unidad_medida: unidadMedida,
                tipoAjusteId: selectedAjuste.id,
                estado: 0
            };
            setParticiones(prevParticiones => [...prevParticiones, nuevaParticion]);
            tamañoRef.current.value = "";
            unidadMedidaRef.current.value = "";
            setError("");
        } else {
            setError("Todos los campos son obligatorios.");
        }
    };

    const handleEnviar = () => {
        if (particiones.length === 6) {
            enviarParticiones(particiones);
        }
    };

    const handleSelectChange = (event) => {
        setUnidadMedida(event.target.value);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openParticionesModal = () => {
        setIsModalOpen(false);
        setIsParticionesModalOpen(true);
    };

    const closeParticionesModal = () => {
        setIsModalOpen(false);
        setIsParticionesModalOpen(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            setLoading(true);
            axios.get(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/mostrarAjustes`)
                .then(response => {
                    setAjustes(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Error al cargar los ajustes');
                    setLoading(false);
                });
        }
    }, [isModalOpen]);

    const enviarParticiones = (particiones) => {
        axios.post(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/crearParticion`, {
            particiones
        })
        .then(response => {
            alert('Particiones creadas exitosamente');
            setParticiones(response.data);
            setIsParticionesModalOpen(false);
        })
        .catch(error => {
            alert('Error al crear particiones');
            console.error(error);
        });
    };

    const handleChange = (event) => {
        const selectedId = event.target.value;
        const ajusteSeleccionado = ajustes.find(ajuste => ajuste.id === parseInt(selectedId));
        setSelectedAjuste(ajusteSeleccionado);
        setIsButtonEnabled(ajusteSeleccionado !== undefined);
    };

    const CrearParticiones = ({ isOpen, onClose }) => {
        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="Crear Particiones"
                className="modal-partitions"
                overlayClassName="modal-overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div>
                    <h2>Cree 6 particiones</h2>
                    <form>
                        <div>
                            <input
                                ref={tamañoRef}
                                placeholder="Tamaño de la partición"
                                type="number"
                                min="1"
                                disabled={particiones.length === 6}
                                required
                            />
                        </div>
                        <div>
                            <select 
                                ref={unidadMedidaRef}
                                disabled={particiones.length === 6}
                                required
                            >
                                <option value="">Selecciona una unidad</option>
                                <option value="KB">KB</option>
                                <option value="MB">MB</option>
                            </select>
                        </div>
                        <div>
                            <button 
                                type="button" 
                                onClick={agregarParticion}
                                disabled={particiones.length === 6}
                            >
                                Agregar partición
                            </button>
                        </div>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
    
                    <div>
                        <h3>Particiones agregadas</h3>
                        {particiones.length > 0 && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tamaño</th>
                                        <th>Unidad de Medida</th>
                                        <th>Tipo Ajuste ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {particiones.map((particion, index) => (
                                        <tr key={index}>
                                            <td>{particion.tamaño}</td>
                                            <td>{particion.unidad_medida}</td>
                                            <td>{particion.tipoAjusteId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
    
                    <div>
                        <button 
                            onClick={handleEnviar} 
                            disabled={particiones.length !== 6}
                        >
                            Enviar Particiones
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    const ModalAjustes = ({ isOpen, onClose }) => {
        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="Ajustes de Memoria"
                className="modal-content"
                overlayClassName="modal-overlay"
                shouldCloseOnOverlayClick={false}
            >
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Selecciona un Ajuste de Memoria</h2>
                <div className="dropdown-container">
                    <label htmlFor="memoria-ajustes">Selecciona un ajuste:</label>
                    <select id="memoria-ajustes" className="dropdown" onChange={handleChange} value={selectedAjuste?.id || ""}>
                        <option value="">-- Selecciona un ajuste --</option>
                        {ajustes.map((ajuste) => (
                            <option key={ajuste.id} value={ajuste.id}>
                                {ajuste.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedAjuste && (
                    <div>
                        <label>{selectedAjuste.descripcion}</label>
                    </div>
                )}
                <div>
                    <button 
                        onClick={openParticionesModal} 
                        disabled={!isButtonEnabled}
                    >
                        Aceptar
                    </button>
                </div>
            </Modal>
        );
    };

    const asignarProceso = async (proceso) => { 
        console.log("Proceso:", proceso);
        console.log("Selected Ajuste ID:", selectedAjuste.id);
    
        const particionesDisponibles = particiones.filter(particion => particion.estado === 0);
        console.log("Particiones Disponibles:", particionesDisponibles);
    
        let particionAsignada = null;
        const tamañoProcesoBytes = convertirABytes(proceso.tamaño, proceso.unidad_medida);
        console.log("Tamaño Proceso en Bytes:", tamañoProcesoBytes);
    
        switch (selectedAjuste.id) {
            case 1: // Primer Ajuste
                particionAsignada = particionesDisponibles.find(particion =>
                    convertirABytes(particion.tamaño, particion.unidad_medida) >= tamañoProcesoBytes
                );
                console.log("Particion Asignada (Primer Ajuste):", particionAsignada);
                break;
            case 2: // Mejor Ajuste
                particionAsignada = particionesDisponibles
                    .filter(particion =>
                        convertirABytes(particion.tamaño, particion.unidad_medida) >= tamañoProcesoBytes
                    )
                    .reduce((prev, curr) => {
                        console.log("Comparando (Mejor Ajuste): Prev:", prev, "Curr:", curr);
                        return convertirABytes(prev.tamaño, prev.unidad_medida) < convertirABytes(curr.tamaño, curr.unidad_medida) ? prev : curr;
                    }, null);
                console.log("Particion Asignada (Mejor Ajuste):", particionAsignada);
                break;
            case 3: // Peor Ajuste
                const particionesAdecuadas = particionesDisponibles.filter(particion =>
                    convertirABytes(particion.tamaño, particion.unidad_medida) >= tamañoProcesoBytes
                );
    
                if (particionesAdecuadas.length > 0) {
                    particionAsignada = particionesAdecuadas.reduce((prev, curr) => {
                        const prevTamañoBytes = convertirABytes(prev.tamaño, prev.unidad_medida);
                        const currTamañoBytes = convertirABytes(curr.tamaño, curr.unidad_medida);
                        console.log("Comparando Particiones (Peor Ajuste): Prev:", prev, "Curr:", curr);
                        return prevTamañoBytes > currTamañoBytes ? prev : curr;
                    });
                }
                console.log("Particion Asignada (Peor Ajuste):", particionAsignada);
                break;
            case 4: // Siguiente Ajuste
                const indexActual = particiones.findIndex(particion => particion.id === proceso.particion_id);
                console.log("Index Actual:", indexActual);
                particionAsignada = particionesDisponibles.slice(indexActual + 1)
                    .find(particion => convertirABytes(particion.tamaño, particion.unidad_medida) >= tamañoProcesoBytes);
                console.log("Particion Asignada (Siguiente Ajuste):", particionAsignada);
                break;
            default:
                console.error('Tipo de ajuste no reconocido.');
                return;
        }
    
        console.log("Particion Asignada Final:", particionAsignada);
    
        try {
            if (particionAsignada) {
                // Crear asignación
                await axios.post(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/crearAsignacion`, {
                    id: proceso.id,
                    proceso_id: proceso.id,
                    particion_id: particionAsignada.id
                });
    
                // Actualizar estado de partición
                await axios.patch(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/actualizarEstadoParticion/${particionAsignada.id}`, {
                    estado: 1
                });
    
                // Actualizar estado del proceso
                await axios.patch(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/actualizarEstadoProceso/${proceso.id}`);
    
                // Actualizar estado de las particiones y procesos localmente
                setParticiones(prevParticiones =>
                    prevParticiones.map(particion =>
                        particion.id === particionAsignada.id ? { ...particion, estado: 1 } : particion
                    )
                );
    
                setProcesos(prevProcesos =>
                    prevProcesos.map(p =>
                        p.id === proceso.id ? { ...p, estado: 1 } : p
                    )
                );
    
                setAsignaciones(prevAsignaciones => [
                    ...prevAsignaciones,
                    {
                        id: proceso.id,
                        proceso_id: proceso.id,
                        particion_id: particionAsignada.id
                    }
                ]);
            } else {
                // Si no hay partición asignada, agregar proceso a la cola
                await axios.post(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/crearColaProceso`, {
                    proceso_id: proceso.id,
                    prioridad: prioridad
                });
    
                // Actualizar prioridad del proceso
                await axios.patch(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/actualizarPrioridadProceso/${proceso.id}`, {
                    prioridad: prioridadP
                });
    
                // Actualizar localmente la cola y procesos
                setColaProcesos(prevColaProcesos => [
                    ...prevColaProcesos,
                    {
                        proceso_id: proceso.id,
                        prioridad: prioridad
                    }
                ]);
    
                setProcesos(prevProcesos =>
                    prevProcesos.map(p =>
                        p.id === proceso.id ? { ...p, prioridad: prioridadP } : p
                    )
                );
    
                // Incrementar las prioridades
                setPrioridad(prioridad + 1);
                setPrioridadP(prioridadP + 1);
            }
        } catch (error) {
            console.error('Error durante el proceso de asignación o cola:', error);
            alert('Error al procesar la asignación o cola.');
        }
    };           

    const handleAddProceso = (event) => { 
        event.preventDefault();
    
        const nombre = nombreProcesoRef.current?.value;
        const tamaño = tamañoProcesoRef.current?.value;
    
        console.log("Nombre:", nombre);
        console.log("Tamaño:", tamaño);
        console.log("Unidad Medida:", unidadMedida);
    
        if (nombre && tamaño && unidadMedida) {
            const nuevoProceso = {
                nombre,
                tamaño: tamaño,
                unidad_medida: unidadMedida,
                estado: 0,
                prioridad: 0
            };
    
            axios.post(`${process.env.REACT_APP_SIM_GESTION_MEMORY_API}/gestion-memoria/crearProceso`, nuevoProceso)
            .then(response => {
                const procesoCreado = response.data;
                setProcesos(prevProcesos => [...prevProcesos, procesoCreado]);
                asignarProceso(procesoCreado);
    
                nombreProcesoRef.current.value = "";
                tamañoProcesoRef.current.value = "";
                setUnidadMedida('');
            })
            .catch(error => {
                console.error('Error al crear proceso:', error);
                alert('Error al crear proceso. Verifique la consola para más detalles.');
            });
        } else {
            setError("Todos los campos son obligatorios.");
        }
    };      

    return (
        <Fragment>
            <ModalAjustes
                isOpen={isModalOpen}
                onClose={closeModal}
                ajustes={ajustes}
                loading={loading}
                error={error}
                handleChange={handleChange}
                selectedAjuste={selectedAjuste}
            />
            <CrearParticiones 
                isOpen={isParticionesModalOpen} 
                onClose={closeParticionesModal}
                selectedAjuste={selectedAjuste}
            />
            {console.log(procesos)}
            <div className="container">
                <div className="containerFormsYtable">
                    <form onSubmit={handleAddProceso}>
                        <div className="divFormContainer">
                            <div className="inputBox1">
                                <input
                                    className="procesoYTamañoInput"
                                    type="text"
                                    required
                                    ref={nombreProcesoRef}
                                />
                                <label className="procesoYTamañoLabel">Proceso</label>
                            </div>
                            <div className="inputBox2">
                                <input
                                    ref={tamañoProcesoRef}
                                    type="number"
                                    className="procesoYTamañoInput"
                                    min="0.01"   // Permite valores positivos
                                    step="any"   // Permite números decimales
                                    required
                                />
                                <label className="procesoYTamañoLabel">Tamaño</label>
                            </div>

                            <div className="selectBox"> 
                                <select
                                    value={unidadMedida}
                                    onChange={handleSelectChange}
                                    className="procesoYTamañoInput"
                                    required
                                >
                                    <option value="">Selecciona una unidad</option>
                                    <option value="KB">KB</option>
                                    <option value="MB">MB</option>
                                </select>
                            </div>
                        </div>
                        <button className="botonEnviar" type="submit">Enviar</button>
                    </form>

                    <div className="containerTablaProcs">
                        <table className="tabla-procesos">
                            <thead>
                                <tr>
                                    <th>Nombre del Proceso</th>
                                    <th>Tamaño del Proceso</th>
                                    <th>Tamaño de la particion</th>
                                    <th>Fragmentación</th>
                                    <th>En Cola?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {procesos.length > 0 ? procesos.map((proceso, index) => {
                                    // Encuentra la asignación y la partición correspondientes
                                    const asignacion = asignaciones.find(asign => asign.proceso_id === proceso.id);
                                    const particion = asignacion ? particiones.find(part => part.id === asignacion.particion_id) : null;

                                    // Convierte tamaños a bytes
                                    const tamañoParticionBytes = particion ? convertirABytes(particion.tamaño, particion.unidad_medida) : 0;
                                    const tamañoProcesoBytes = convertirABytes(proceso.tamaño, proceso.unidad_medida);

                                    // Calcula la fragmentación
                                    const fragmentacionBytes = particion ? Math.max(tamañoParticionBytes - tamañoProcesoBytes, 0) : 0;

                                    // Determina la unidad de medida y ajusta los valores
                                    const unidadMedida = particion ? particion.unidad_medida : 'B';
                                    const tamañoParticionActual = particion ? convertirDeBytes(tamañoParticionBytes, unidadMedida) : 0;
                                    const fragmentacionActual = convertirDeBytes(fragmentacionBytes, unidadMedida);

                                    const enCola = colaProcesos.some(p => p.proceso_id === proceso.id) ? 'Sí' : 'No';
                                    return (
                                        <tr key={index}>
                                            <td>{proceso.nombre}</td>
                                            <td>{proceso.tamaño}{proceso.unidad_medida}</td>
                                            <td>{tamañoParticionActual.toFixed(3)}{unidadMedida}</td>
                                            <td>{fragmentacionActual.toFixed(3)}{unidadMedida}</td>
                                            <td>{enCola}</td>
                                            <td><img 
                                                    className="papelera" src={papeleraNegra} 
                                                    alt="Papelera"
                                                />
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <><label>En espera de datos</label><div className="loader"></div></>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <table className="tabla-memoria">
                            <thead>
                                <tr>
                                    <th>Sistema Operativo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {particiones.length > 0 ? particiones.map((particion, index) => (
                                    <tr key={index}>
                                        <td>
                                            {particion.tamaño}
                                            {particion.unidad_medida}
                                        </td>
                                    </tr>
                                )) : (
                                    <><label>En espera de datos</label><div className="loader"></div></>
                                )}
                            </tbody>
                        </table>
                </div>
            </div>
        </Fragment>
    );
}
