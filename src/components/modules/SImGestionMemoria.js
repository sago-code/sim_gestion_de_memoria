import React, { Fragment } from "react";
import '../styles/SimGestionMemoria.css';

const datosMemoria = [
    {tamaño: '50KB' },
    {tamaño: '80KB' },
    {tamaño: '100KB'},
    {tamaño: '150KB'},
    {tamaño: '200KB'},
    {tamaño: '230KB'}
];

export function SimGestionMemoria() {
    return (
        <Fragment>
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
                                <label className="procesoYTamañoLabel">tamaño</label>
                            </div>
                            <button className="botonEnviar">Enviar</button> 
                        </div>
                    </form>

                    <div className="containerTablaProcs">
                        <table className="tabla-procesos">
                            <thead>
                                <tr>
                                    <th>nombre del proceso</th>
                                    <th>tamaño del proceso</th>
                                    <th>ubicacion del proceso</th>
                                    <th>tamaño de la pagina</th>
                                    <th>fragmentacion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>word</td>
                                    <td>20KB</td>
                                    <td>pagina 1</td>
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