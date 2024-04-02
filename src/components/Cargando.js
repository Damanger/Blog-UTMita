import React from 'react';
import '../css/cargando.css';

const Cargando = ({ url }) => {
    return (
        <div className="cargando">
            <img src={url} alt="Cargando..." />
        </div>
    );
};

export default Cargando;
