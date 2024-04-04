import './App.css';
import React, { useState, useEffect, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllPosts, OnePost } from './components';
import Navbar from './components/NavBar';
const Cargando = lazy(() => import('./components/Cargando'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;

        const scrollWatcher = document.querySelector('.scroll-watcher');
        scrollWatcher.style.width = scrolled + '%';
    });
}, []);
  return (
    <BrowserRouter>
    {isLoading ? (
        <Cargando url="https://raw.githubusercontent.com/Damanger/Blog-UTMita/main/public/utm2.webp" />
      ) : (
        <>
        <Navbar/>
        <div className="scroll-watcher"></div>
          <Routes>
            <Route Component={AllPosts} path='/' exact/>
            <Route Component={OnePost} path='/:slug' exact/>
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
