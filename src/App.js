import './App.css';
import React, { useState, useEffect, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllPosts, OnePost } from './components';
import Navbar from './components/NavBar';
import Contacto from './components/Contacto';
import ChatBot from 'react-simple-chatbot';
import Chat from './components/Chat';
const Cargando = lazy(() => import('./components/Cargando'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
                { value: 2, label: '¿Cómo puedo contactar a un tutor?', trigger: 'contactar' },
                { value: 3, label: '¿Cuáles son los costos por las cursos/materias?', trigger: 'costos' },
                { value: 4, label: '¿A partir de qué semestre puedo dar asesorías?', trigger: 'semestre' },
                { value: 5, label: '¿Tengo que ser estudiante de la UTM para dar cursos/materias?', trigger: 'estudiante' },
                { value: 6, label: '¿Cómo puedo cambiar de tutor?', trigger: 'cambio' },
                { value: 7, label: '¿Puedo impartir un curso/materia?', trigger: 'impartir' },
                { value: 8, label: '¿Cómo reporto a un tutor?', trigger: 'reportar' },
                { value: 9, label: '¿Qué hago si mi tutor no se presenta?', trigger: 'ausente' },
                { value: 10, label: '¿Cómo cancelar una tutoría?', trigger: 'cancelar' },
                { value: 11, label: '¿Otorgan diplomas/reconocimientos por los cursos/materias tomadas?', trigger: 'reconocimientos' },
                { value: 12, label: '¿Dan comprobantes de cursos/materias tomadas?', trigger: 'comprobantes' },
                { value: 13, label: '¿Qué tipo de cursos/materias hay?', trigger: 'catálogo' },
                { value: 14, label: '¿Cuánto tiempo durará este proyecto?', trigger: 'proyecto' },
                { value: 15, label: '¿Las clases son colectivas/individuales?', trigger: 'clases' },
                { value: 16, label: '¿Dónde serán impartidas las tutorías?', trigger: 'lugar' },
                { value: 17, label: '¿Quién está detrás de este proyecto?', trigger: 'admins' },
              ],
            },
            {
              id: 'horario',
              message: 'Nuestro horario de atención es de lunes a viernes de 9am a 6pm.',
              trigger: 'menu',
            },
            {
              id: 'contactar',
              message: 'Puedes contactar a cada profesor hiendo directamente a su link personal, ahí encontrarás los métodos de contacto para localizarlo.',
              trigger: 'menu',
            },
            {
              id: 'costos',
              message: 'Cada profesor cuenta con diferentes costos para sus cursos/materias a impartir, puedes ver los costos en su perfil.',
              trigger: 'menu',
            },
            {
              id: 'semestre',
              message: 'Puedes impartir cursos/materias estando en 1er semestre hasta 10° semestre, depende de ti el área que quieras cubrir en tu curso/materia.',
              trigger: 'menu',
            },
            {
              id: 'estudiante',
              message: 'Sí, para dar cursos/materias tienes que ser estudiante de la UTM.',
              trigger: 'menu',
            },
            {
              id: 'cambio',
              message: 'Puedes cambiar de tutor cuando gustes, simplemente elige otro tutor con el que te interese tomar algún curo/materia.',
              trigger: 'menu',
            },
            {
              id: 'impartir',
              message: 'Sí, si eres estudiante de la UTM puedes dar cursos/materias.',
              trigger: 'menu',
            },
            {
              id: 'reportar',
              message: 'Puedes reportar a un tutor entrando a su perfil directamente y escribiendo tu comentario/reseña.',
              trigger: 'menu',
            },
            {
              id: 'ausente',
              message: 'Puedes reportarlo agregando un comentario en su perfil o mandándonos un correo en la pestaña de Contacto.',
              trigger: 'menu',
            },
            {
              id: 'cancelar',
              message: 'Si deseas cancelar una tutoría puedes enviarle un mensaje a tu tutor en cuestión o contactándonos en la pestaña de Contacto.',
              trigger: 'menu',
            },
            {
              id: 'reconocimientos',
              message: 'Lamentablemente no ofrecemos diplomas o reconocimientos.',
              trigger: 'menu',
            },
            {
              id: 'comprobantes',
              message: 'Lamentablemente no ofrecemos algún comprobante del curso/materia tomada.',
              trigger: 'menu',
            },
            {
              id: 'catálogo',
              message: 'Hay cursos/materias sobre las diversas carreras de la UTM y/o sobre temas donde los tutores cuentan con los conocimientos para impartir los cursos/materias.',
              trigger: 'menu',
            },
            {
              id: 'proyecto',
              message: 'Por el momento tiene una duración de 1 semestre para ser administrada la página web.',
              trigger: 'menu',
            },
            {
              id: 'clases',
              message: 'Las clases dependerán de cada tutor, podrán ser impartidas de manera individual o colectiva.',
              trigger: 'menu',
            },
            {
              id: 'lugar',
              message: 'El lugar de las tutorías dependerán de cada tutor.',
              trigger: 'menu',
            },
            {
              id: 'admins',
              message: 'Somos estudiantes de la UTM interesados en otorgar la facilidad de encontrar tutores para diversos cursos/materias.',
              trigger: 'menu',
            },
          ]}
          floating={true}
          botAvatar="https://raw.githubusercontent.com/Damanger/Portfolio/main/public/Ardilla.webp"
          userAvatar="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Blank_user.svg/1707px-Blank_user.svg.png"
          headerTitle="UTMita ChatBot"
          placeholder="Escribe tu mensaje..."
        />
          <Routes>
            <Route Component={AllPosts} path='/' exact/>
            <Route Component={Contacto} path='/contacto' exact/>
            <Route Component={Chat} path='/chat' exact/>
            <Route Component={OnePost} path='/:slug' exact/>
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
