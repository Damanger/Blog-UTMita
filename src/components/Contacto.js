import React, { useState } from 'react';
import '../css/Contacto.css'
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';
const Contacto = () =>{
    const [captcha, setCaptcha] = useState(null);

    const handleCaptcha = value => {
        setCaptcha(value);
    };


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        message: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!captcha) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, completa el captcha',
                text: 'Para enviar el formulario, necesitas completar el captcha.',
            });
            return; // Detiene la ejecución de la función si el captcha no está completo
        }
        // Inicializa EmailJS con tu clave pública
        emailjs.init('1wQ5hcO2lkSg1UWH6');

        // Obtén los valores de los campos del formulario
        const fullNameInput = document.querySelector('#Nombre');
        const emailInput = document.querySelector('#Correo');
        const phoneNumberInput = document.querySelector('#Telefono');
        const messageTextarea = document.querySelector('textarea[placeholder="  Escriba su mensaje"]');

        // Crea un objeto con los datos del formulario
        const formData = {
            name: fullNameInput.value,
            email: emailInput.value,
            phoneNumber: phoneNumberInput.value,
            subject: "Duda",
            message: messageTextarea.value
        };
        // Verificar si se ingresó un número de teléfono
        const phoneNumberValue = formData.phoneNumber ? formData.phoneNumber : 'No dejó número';

        // Envía el formulario a través de EmailJS
        emailjs.send("service_7ac3amo", "template_1ngo741", {from_name: 'Name: ' + formData.name + '\nEmail: ' + formData.email + '\nPhone Number: ' + phoneNumberValue + '\nSubject: ' + formData.subject, 
        message: '\nMessage:' + formData.message})
        .then(function(response) {
            Swal.fire(
                '¡Correo Enviado!',
                '¡Tu correo fue enviado exitosamente!',
                'success'
            );
            // Resetear el formulario después de enviar el correo
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                message: ''
            });
        }, function(error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡Algo salió mal, no pudimos enviar tu correo!'
            });
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    return (
        <>
            <div className="container">
                <span className="big-circle"></span>
                <div className="formDiv">
                    <div className="contact-info">
                        <h1 className="title">Contáctanos</h1>
                        <p className="text">
                            Horarios:<br/> 
                            Lunes a Viernes de 09:00-20:00<br/>
                            Sábados de 10:00-20:00
                        </p>
                        
                        <div className="info">
                            <div className="information">
                                <img src="email.png" className="icon" alt="" />
                                <a href="mailto:dummie@gmail.com">dummie@gmail.com</a>
                            </div>
                        </div>

                    </div>

                    <div className="contact-form">
                        <span className="circle one"></span>
                        <span className="circle two"></span>

                        <form className='formContacto' onSubmit={handleSubmit}>
                            <h2 className="titleContacto">Envía un correo</h2>
                            <div className="input-container">
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='  Nombre' id='Nombre' className="input" pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,}(\s[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,})?(\s[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,}){1,2}$" autoComplete="off" required/>
                            </div>
                            <div className="input-container">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='  Correo electrónico' id='Correo' className="input" pattern=".+@gs.utm.mx" title="Por favor, introduce un correo válido con el dominio @gs.utm.mx" autoComplete="off" required/>
                            </div>
                            <div className="input-container">
                                <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder='  Teléfono' id='Telefono' className="input" autoComplete="off"/>
                            </div>
                            <div className="input-container textarea">
                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder='  Escriba su mensaje' className="input" required/>
                            </div>
                            <div>
                                <ReCAPTCHA sitekey="6LcFb7YpAAAAAKMGk7zzrJkOXMQUvNPdoB4JlMnS" onChange={handleCaptcha} />
                            </div>
                                <button type="submit" value="Enviar">Enviar </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contacto