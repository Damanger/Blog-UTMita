import './App.css';
import React, { useState, useEffect, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllPosts, OnePost } from './components';
import Navbar from './components/NavBar';
import Contacto from './components/Contacto';
const Cargando = lazy(() => import('./components/Cargando'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <BrowserRouter>
    {isLoading ? (
        <Cargando url="https://raw.githubusercontent.com/Damanger/Blog-UTMita/main/public/utm2.webp" />
      ) : (
        <>
        <Navbar/>
          <Routes>
            <Route Component={AllPosts} path='/' exact/>
            <Route Component={Contacto} path='/contacto' exact/>
            <Route Component={OnePost} path='/:slug' exact/>
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
