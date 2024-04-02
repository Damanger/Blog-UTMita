import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllPosts, OnePost } from './components';
import Cargando from './components/Cargando';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);
  return (
    <BrowserRouter>
    {isLoading ? (
        <Cargando url="https://raw.githubusercontent.com/Damanger/Blog-UTMita/main/public/utm2.webp" />
      ) : (
        <div>
          <Routes>
            <Route Component={AllPosts} path='/' exact/>
            <Route Component={OnePost} path='/:slug' exact/>
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
