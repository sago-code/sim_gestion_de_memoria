import React, { Fragment } from "react";
import '../styles/SimGestionMemoria.css';

const datosMemoria = [
    {tamaño: '12MB' },
    {tamaño: '24MB' },
    {tamaño: '40MB'},
    {tamaño: '60MB'}
];

export function SimGestionMemoria() {
    return(
        <Fragment>
            <table className="tabla-memoria">
                <thead>
                    <tr>
                        <th>memoria ram</th>
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
