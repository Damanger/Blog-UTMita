import './App.css';
import React, { useState, useEffect, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllPosts, OnePost } from './components';
import Navbar from './components/NavBar';
import Contacto from './components/Contacto';
import ChatBot from 'react-simple-chatbot';
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
        <ChatBot
          steps={[
            {
              id: '1',
              message: '¡Hola! ¿Cuál es tu nombre?',
              trigger: '2',
            },
            {
              id: '2',
              user: true,
              trigger: '3',
            },
            {
              id: '3',
              message: 'Hola {previousValue}, ¡Un gusto conocerte!',
              trigger: 'faq',
            },
            {
              id: 'faq',
              message: '¿En qué puedo ayudarte hoy?',
              trigger: 'menu',
            },
            {
              id: 'menu',
              options: [
                { value: 1, label: '¿Cuál es el horario de atención?', trigger: 'horario' },
                { value: 2, label: '¿Cómo puedo hacer una reserva?', trigger: 'reserva' },
                { value: 3, label: '¿Cuáles son sus precios?', trigger: 'precios' }
              ],
            },
            {
              id: 'horario',
              message: 'Nuestro horario de atención es de lunes a viernes de 9am a 6pm.',
              trigger: 'menu',
            },
            {
              id: 'reserva',
              message: 'Puedes hacer una reserva llamando al número XXXX o enviando un correo electrónico a correo@example.com.',
              trigger: 'menu',
            },
            {
              id: 'precios',
              message: 'Para conocer nuestros precios, te recomendamos visitar nuestra página web o contactarnos directamente.',
              trigger: 'menu',
            },
          ]}
          floating={true}
          botAvatar="https://raw.githubusercontent.com/Damanger/Portfolio/main/public/Ardilla.webp"
          userAvatar="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Blank_user.svg/1707px-Blank_user.svg.png"
          floatingIcon={<div className="custom-floating-icon" />}
        />

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
