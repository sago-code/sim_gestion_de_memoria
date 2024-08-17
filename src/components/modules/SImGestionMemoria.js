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
    return(
        <Fragment>
            <div>
                <form>
                    <div>
                        <text>Proceso</text>
                        <input
                            placeholder: "tarea, programa o proceso"
                        />
                        <button>Enviar</button> 
                    </div>
                </form>
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
        </Fragment>
    );
}
