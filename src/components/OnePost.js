import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../client';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { Link } from 'react-router-dom';
import { faWhatsapp, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/OnePost.css';

const builder = imageUrlBuilder(sanityClient);

const urlFor = (source) => {
    return builder.image(source);
}

const OnePost = () => {
    const [postData, setPostData] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        sanityClient.fetch(
            `*[slug.current == $slug]{
                title,
                slug,
                mainImage{
                    asset->{
                        _id,
                        url
                    }
                },
                body,
                "name": author->name
            }`,
            { slug }
        )
        .then(data => setPostData(data[0]))
        .catch(err => console.error(err));
    }, [slug]) 

    if (!postData || !postData.title) {
        return( 
        <>
            
        </>);
    }

    return (
        <div className='container23' style={{ animation: 'fadeIn 1s ease-in' }}>
            <div className="ss2">
                <h1 style={{display:'flex', justifyContent:'center', alignContent:'center'}}>{postData.title}</h1>
                <div style={{display:'flex', justifyContent:'center', marginTop: '20px'}}>
                    <Link to="/" style={{ textDecoration: "none"}}>
                        <button>Regresar</button>
                    </Link>
                </div>
            </div>
            <div className="ss3">
                <div style={{display:'flex', justifyContent:'center'}}>
                <img src={urlFor(postData.mainImage).url()} style={{ objectFit:'cover'}}  alt='Imagen_UTMita' width="250" height="250"/>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                <h2>{postData.name}</h2>
                </div>
            </div>
            <div className="ss">
                <h3 style={{display:'flex', justifyContent:'center', textAlign:'center'}}>Materias o cursos que puedo impartir:</h3>
                <div style={{display:'flex', justifyContent:'center', textAlign:'center'}} >
                    <BlockContent blocks={postData.body} />
                </div>
            </div>
            <div className="ss4">
                <div className="icon">
                    <a className='whats' href="https://wa.me/5219531233771?text=Buen%20d%C3%ADa,%20quise%20contactarlo%20para%20un%20servicio%20de%20baile%20privado." target="_blank" rel='noreferrer' aria-label="Whatsapp">
                        <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                    </a>
                    <a className='mail' href="mailto:sarl021022@gs.utm.mx" aria-label="Correo">
                        <span><FontAwesomeIcon icon={faTelegramPlane} /></span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default OnePost
