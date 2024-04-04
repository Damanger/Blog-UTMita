import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import '../css/Navbar.css';

export default function Navbar(){
    const [activeStyle, setActiveStyle] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            setActiveStyle({ borderBottom: "0.2rem solid white" });
        } else if (location.pathname === "/contacto") {
            setActiveStyle({ borderBottom: "0.2rem solid white" });
        } else {
            setActiveStyle({});
        }
    }, [location]);

    return(
        <header className="cabecera">
            <nav className='navbar-nav'>
                <NavLink to='/' className='navbar-nav-link'>
                    <h4>Universidad Tecnológica de la Mixteca</h4>
                </NavLink>
                <div className='navbar-right-links'>
                    <NavLink to='/' activeclassname="activo" className='navbar-nav-link' style={location.pathname === "/" ? activeStyle : {}}>
                        Inicio
                    </NavLink>
                    <NavLink to='/contacto' activeclassname="activo" className='navbar-nav-link' style={location.pathname === "/contacto" ? activeStyle : {}}>
                        Contacto
                    </NavLink>
                </div>
            </nav>
        </header>
    )
}
