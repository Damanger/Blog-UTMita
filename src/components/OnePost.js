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
    const [showLoader, setShowLoader] = useState(true);
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
    }, [slug]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (showLoader || !postData || !postData.title) {
        return( 
        <>
            <div className='ratoncillo'>
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                    <div className="wheel"></div>
                    <div className="hamster">
                        <div className="hamster__body">
                            <div className="hamster__head">
                                <div className="hamster__ear"></div>
                                <div className="hamster__eye"></div>
                                <div className="hamster__nose"></div>
                            </div>
                            <div className="hamster__limb hamster__limb--fr"></div>
                            <div className="hamster__limb hamster__limb--fl"></div>
                            <div className="hamster__limb hamster__limb--br"></div>
                            <div className="hamster__limb hamster__limb--bl"></div>
                            <div className="hamster__tail"></div>
                        </div>
                    </div>
                    <div className="spoke"></div>
                </div>
            </div>
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

export default OnePost;
