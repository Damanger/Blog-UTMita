import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';
import BlockContent from '@sanity/block-content-to-react';
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

    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [carrera, setCarrera] = useState("");

    function updateFileName(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const fileName = file.name;
            setFileName(fileName);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, seleccione un archivo de imagen.");
            event.target.value = "";
            setFileName("");
            setImagePreview(null);
        }
    }

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
                                <form className="form">
                                    <div className="title">Quiero dar clases</div>
                                    <input type="text" placeholder="Nombre completo" />
                                    <select value={carrera} onChange={(e) => setCarrera(e.target.value)}>
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
                                    <input type="number" placeholder="Teléfono" />
                                    <input type="email" placeholder="Correo" />
                                    <label htmlFor="file-upload" style={{color:'black'}}>Credencial UTM:</label>
                                    <input type="file" id="file-upload" accept="image/*" onChange={updateFileName} />
                                    {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />}
                                    <span>{fileName ? `Credencial UTM: ${fileName}` : "Seleccione un archivo"}</span>
                                    <textarea style={{color:'black'}} placeholder="Materias o cursos que puedo impartir"></textarea>
                                    <button>Enviar</button>
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
                    className="input"
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
