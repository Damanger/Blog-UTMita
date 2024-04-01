import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllPosts, OnePost } from './components';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route Component={AllPosts} path='/' exact/>
          <Route Component={OnePost} path='/:slug' exact/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
