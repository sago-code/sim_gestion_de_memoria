import React, { Fragment, useState, useEffect } from "react";
import Modal from 'react-modal';
import '../styles/SimGestionMemoria.css';
import axios from 'axios';

const datosMemoria = [
    { tamaño: '50KB' },
    { tamaño: '80KB' },
    { tamaño: '100KB' },
    { tamaño: '150KB' },
    { tamaño: '200KB' },
    { tamaño: '230KB' }
];

Modal.setAppElement('#root');

function ModalAjustes({ isOpen, onClose, ajustes, loading, error, handleChange, selectedAjuste }) {
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
            {loading && <div className="loader">Cargando...</div>}
            {error && <p>{error}</p>}
            <div className="dropdown-container">
                <label htmlFor="memoria-ajustes">Selecciona un ajuste:</label>
                <select id="memoria-ajustes" className="dropdown" onChange={handleChange}>
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
                <button onClick={onClose}>Aceptar</button>
            </div>
        </Modal>
    );
}

export function SimGestionMemoria() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [ajustes, setAjustes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAjuste, setSelectedAjuste] = useState(null);

    const closeModal = () => {
        setIsModalOpen(false);
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

    const handleChange = (event) => {
        const selectedId = event.target.value;
        const ajusteSeleccionado = ajustes.find(ajuste => ajuste.id === parseInt(selectedId));
        setSelectedAjuste(ajusteSeleccionado);
    };

    return (
        <Fragment>
            {/*!isModalOpen && <div className="loader"></div>*/}
            <ModalAjustes
                isOpen={isModalOpen}
                onClose={closeModal}
                ajustes={ajustes}
                loading={loading}
                error={error}
                handleChange={handleChange}
                selectedAjuste={selectedAjuste}
            />
            <div className="container">
                <div className="containerFormsYtable">
                    <form>
                        <div className="divFormContainer">
                            <div className="inputBox1">
                                <input
                                    className="procesoYTamañoInput"
                                    type="text"
                                    required
                                />
                                <label className="procesoYTamañoLabel">Proceso</label>
                            </div>
                            <div className="inputBox2">
                                <input
                                    className="procesoYTamañoInput"
                                    required
                                />
                                <label className="procesoYTamañoLabel">Tamaño</label>
                            </div>
                            <button className="botonEnviar">Enviar</button>
                        </div>
                    </form>

                    <div className="containerTablaProcs">
                        <table className="tabla-procesos">
                            <thead>
                                <tr>
                                    <th>Nombre del Proceso</th>
                                    <th>Tamaño del Proceso</th>
                                    <th>Ubicación del Proceso</th>
                                    <th>Tamaño de la Página</th>
                                    <th>Fragmentación</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Word</td>
                                    <td>20KB</td>
                                    <td>Página 1</td>
                                    <td>50KB</td>
                                    <td>30KB</td>
                                </tr>
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
                            {datosMemoria.map((fila, index) => (
                                <tr key={index}>
                                    <td>{fila.tamaño}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
}
