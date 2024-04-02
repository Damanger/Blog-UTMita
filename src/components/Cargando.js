import React, { useEffect } from 'react';
import '../css/cargando.css';

const Cargando = ({ url }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            const loader = document.querySelector('.cargando');
            if (loader) {
                loader.classList.add('oculto');
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="cargando">
            <img src={url} alt="Cargando..." />
        </div>
    );
};

export default Cargando;
