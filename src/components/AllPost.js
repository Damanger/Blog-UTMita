import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';
import BlockContent from '@sanity/block-content-to-react';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import '../css/AllPost.css';

const AllPost = () => {
    const [allPostData, setAllPostData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % 3);
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        sanityClient.fetch(
            `*[_type == 'post']{
                title, 
                slug,
                mainImage{
                    asset->{
                        _id,
                        url
                    }
                },
                body
            }`
        )
        .then(data => setAllPostData(data))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }, [allPostData]);

    const placeholders = ['Buscar', 'Materias', 'Cursos'];

    const filteredPosts = allPostData && allPostData.filter(post =>
        post.title.toLowerCase().includes(searchText.toLowerCase()) || 
        (typeof post.body === 'object' && JSON.stringify(post.body).toLowerCase().includes(searchText.toLowerCase()))
    );            

    const handleSearchChange = (event) => {
        const text = event.target.value;
        setSearchText(text);
    };

    const openModal = () => {
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleModalClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    const [carrera, setCarrera] = useState("");

    const formRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Inicializa EmailJS con tu clave pública
        emailjs.init('1wQ5hcO2lkSg1UWH6');

        // Obtén los valores de los campos del formulario
        const formData = {
            name: event.target.elements["full-name-input"].value,
            email: event.target.elements["email-input"].value,
            phoneNumber: event.target.elements["phone-number-input"].value,
            subject: 'Quiero dar cursos/materias de',
            message: event.target.elements["textarea"].value,
            carrera: carrera,
            credencial: event.target.elements["input-img-credencial"].value,
            tu: event.target.elements["input-img-tu"].value
        };

        // Verificar si se ingresó un número de teléfono
        const phoneNumberValue = formData.phoneNumber ? formData.phoneNumber : 'No dejó número';

        // Crear objeto FormData para adjuntar el archivo
        const formDataWithFile = new FormData();

        formDataWithFile.append("name", formData.name);
        formDataWithFile.append("email", formData.email);
        formDataWithFile.append("phoneNumber", phoneNumberValue);
        formDataWithFile.append("subject", formData.subject);
        formDataWithFile.append("message", formData.message);
        formDataWithFile.append("carrera", formData.carrera);
        formDataWithFile.append("credencial", formData.credencial);
        formDataWithFile.append("tu", formData.tu);

        // Envía el formulario a través de EmailJS
        emailjs.send("service_7ac3amo", "template_1ngo741", {
            from_name: 'Nombre: ' + formData.name + '\nE-mail: ' + formData.email + '\nCarrera:' + formData.carrera + '\nNúmero de teléfono: ' + phoneNumberValue  + '\nAsunto: ' + formData.subject,
            message: '\nMaterias:' + formData.message + '\nCredencial:' + formData.credencial + '\nFoto:' + formData.tu
        })
        .then(function(response) {
            Swal.fire(
                'Email sent!',
                '¡Tu e-mail se envió correctamente!',
                'success',
                closeModal()
            );
        }, function(error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡Algo salió mal, tu e-mail no se pudo enviar!'
            });
        });
    };

    return (
        <>
            <div className="title-container">
                <h1 className='tituloTutores'>Tutores UTeMitas</h1>
                <button className="quiero-dar-clases" onClick={openModal}>Quiero dar clases</button>
            </div>
            {modalOpen && (
                <div className="modal-overlay" onClick={handleModalClick}>
                    <div className="modal">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="modal-content">
                            <div style={{ display: 'flex', justifyContent: 'center'}}>
                                <form id="myForm" ref={formRef} className="form" onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                                    <div className="title">Quiero dar clases</div>
                                    <input required type="text" id="full-name-input" pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,}(\s[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,})?(\s[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,}){1,2}$" autoComplete="off" placeholder="Nombre completo" />
                                    <select required value={carrera} onChange={(e) => setCarrera(e.target.value)}>
                                        <option value="" disabled defaultValue>Seleccione su carrera</option>
                                        <option value="Ing. Computación">Ing. Computación</option>
                                        <option value="Ing. Alimentos">Ing. Alimentos</option>
                                        <option value="Ing. Electrónica">Ing. Electrónica</option>
                                        <option value="Ing. Mecatrónica">Ing. Mecatrónica</option>
                                        <option value="Ing. Industrial">Ing. Industrial</option>
                                        <option value="Ing. Física Aplicada">Ing. Física Aplicada</option>
                                        <option value="Ing. Mecánica Automotiz">Ing. Mecánica Automotriz</option>
                                        <option value="Ing. Civil">Ing. Civil</option>
                                        <option value="Lic. Ciencias Empresariales">Lic. Ciencias Empresariales</option>
                                        <option value="Lic. Matemáticas Aplicadas">Lic. Matemáticas Aplicadas</option>
                                    </select>
                                    <input type="number" id="phone-number-input" autoComplete="off" placeholder="Teléfono" />
                                    <input required id="email-input" type="email" placeholder="Correo" pattern=".+@gs.utm.mx" title="Por favor, introduce un correo válido con el dominio @gs.utm.mx" autoComplete="off"/>
                                    <label required style={{color:'black'}}>Credencial UTM:</label>
                                    <input required type="text" id="input-img-credencial" placeholder='Link de una foto de tu credencial UTM'/>
                                    <label required style={{color:'black'}}>Foto:</label>
                                    <input required type="text" id="input-img-tu" placeholder='Link de una foto tuya para la página'/>
                                    <textarea required id="textarea" cols="30" rows="10" style={{color:'black'}} placeholder="Materias o cursos que puedo impartir" autoComplete="off"></textarea>
                                    <button type="submit" aria-label="Submit">Enviar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="input-wrapper">
                <input
                    type="text"
                    name="text"
                    className="inputBuscar"
                    placeholder={placeholders[placeholderIndex]}
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </div>
            <hr/>
            <div className="grid-container" >
                {filteredPosts && filteredPosts.map((post) => (
                    <div key={post.slug.current} className="grid-item">
                        <div className="card">
                            <div className="image">
                                <Link to={'/' + post.slug.current}>
                                    <img src={post.mainImage.asset.url} style={{borderRadius:'50%', objectFit:'cover'}} alt='UTMita' width="160" height="160" className="post-image" />
                                </Link>
                            </div>
                            <span className="title">
                                <Link to={'/' + post.slug.current}>
                                    <h2>{post.title}</h2>
                                </Link>
                                <div className='materias'>
                                    <BlockContent blocks={post.body}/>
                                </div>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AllPost;
