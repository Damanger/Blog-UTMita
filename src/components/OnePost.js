import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../client';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { faWeixin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../css/OnePost.css';
import { set } from 'date-fns';


const firebaseApp = initializeApp({
    apiKey: "AIzaSyC2e6pQRyw1xME5KBRjR-QSEHP_6eK_duw",
    authDomain: "utemitas.firebaseapp.com",
    projectId: "utemitas",
    storageBucket: "utemitas.appspot.com",
    messagingSenderId: "155199151252",
    appId: "1:155199151252:web:57580335c4e0da0be7e881",
    measurementId: "G-BMNC0H0K3J"
});

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);


const builder = imageUrlBuilder(sanityClient);

const urlFor = (source) => {
    return builder.image(source);
}  

const OnePost = () => {
    const [postData, setPostData] = useState(null);
    const [showLoader, setShowLoader] = useState(true);
    const { slug } = useParams();
    const [firstBio, setFirstBio] = useState('');
    const [secondBio, setSecondBio] = useState('');
    const [thirdBio, setThirdBio] = useState('');
    const [fourhtBio, setFourhtBio] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const emailProfesor = "sarl021022@gs.utm.mx"; // El email del profesor por el cual quieres filtrar
    const dummy = useRef();
    const comentsRef = collection(firestore, 'coments');
    const q = query(comentsRef, orderBy('createdAt'), limit(25));
    const [coments] = useCollectionData(q, { idField: 'id' });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: null,
        key: 'selection'
    }]);

    const handleToggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

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
                "name": author->name,
                "bio": author->bio
            }`,
            { slug }
        )
        .then(data => {
            setPostData(data[0]);
            if(data[0].bio && typeof data[0].bio[0].children[0].text === 'string'){
                const bioArray = data[0].bio[0].children[0].text.split(' ');
                setFirstBio(bioArray[0]);
                setSecondBio(bioArray[1]);
                setThirdBio(bioArray[2]);
                setFourhtBio(bioArray[3]);
            }else{
                console.error('No se encontró la bio');
            }
        })
        .catch(err => console.error(err));
        console.log(secondBio);
    }, [slug]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };


    const handleModalClick = (event) => {
        if (event.target.classList.contains('modal-comentarios')) {
            closeModal();
        }
    };

    const sendComment = async (e) => {
        

        await addDoc(comentsRef, {
            comment: comment,
            raiting: rating,
            asesor_email: secondBio,
            createdAt: serverTimestamp(),
            
        });
    }

    const handleSubmit = () => {
        sendComment();
        closeModal();
    };

    useEffect(() => {
        const body = document.querySelector('body');
        if (isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    }, [isOpen]);

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
                <h1 style={{display:'flex', justifyContent:'center', alignContent:'center', textAlign:'center'}}>{postData.title}</h1>
                <div style={{display:'flex', justifyContent:'center', marginTop: '20px'}}>
                    <div >
                        <Link to="/" style={{ textDecoration: "none"}}>
                            <button>Regresar</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="ss3">
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img src={urlFor(postData.mainImage).url()} style={{ objectFit:'cover', borderRadius:'25px'}} alt='Imagen_UTMita' width="250" height="250"/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>{postData.name}</h2>
                    <h3>{secondBio}</h3>
                </div>
            </div>
            <div className="ss">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h2>${thirdBio}/hra</h2>
                    <h3 style={{marginTop:'-1rem'}}>Horarios: {fourhtBio}</h3>
                    <button style={{marginBottom:'0.5rem'}} onClick={handleToggleDatePicker}>
                        {showDatePicker ? 'Ocultar Calendario' : 'Mostrar Calendario'}
                    </button>
                    {showDatePicker && (
                        <DateRangePicker
                            onChange={(ranges) => setDateRange([ranges.selection])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            minDate={new Date()}
                            editableDateInputs={true}
                            rangeColors={["#007bff"]}
                        />
                    )}
                </div>
                <h3 style={{display:'flex', justifyContent:'center', textAlign:'center'}}>Materias o cursos que puedo impartir:</h3>
                <div style={{display:'flex', justifyContent:'center', textAlign:'center'}} >
                    <BlockContent blocks={postData.body} />
                </div>
            </div>
            <div className="ss4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Contacto:</h3>
                <div className="icon">
                    <Link className='mail' to="/chat" aria-label="Chat">
                        <span><FontAwesomeIcon icon={faWeixin} /></span>
                    </Link>
                    <a className='whats' href={`https://wa.me/521${firstBio}?text=Buen%20d%C3%ADa,%20quise%20contactarlo%20por%20un%20curso/materia.`} target="_blank" rel='noreferrer' aria-label="Whatsapp">
                        <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                    </a>
                </div>
            </div>
            <div className="ss5">
                <div style={{display:'flex', justifyContent:'center', textAlign:'center'}} >
                    <div style={{marginLeft:"0.4rem"}}>
                        <button onClick={openModal}>Evaluar</button>
                        <div className='coments' style={{marginTop:'2rem', width:'auto', fontSize:'1.4rem'}}>
                            {coments && coments.map((msg, index) => <ComentsFunctionShow key={index} message={msg} emailProfesor={secondBio}/>)}
                            <span ref={dummy}></span>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="modal-comentarios" onClick={handleModalClick}>
                    <div className="modal-content-comentarios">
                        <span className="close-comentarios" onClick={closeModal}>&times;</span>
                        <h2>Vamos a evaluar el curso</h2>
                        <div className="star-container">
                            {[...Array(5)].map((_, index) => (
                                <span key={index} className={index < rating ? 'star filled' : 'star'}
                                    onClick={() => handleStarClick(index + 1)}> 
                                    ★
                                </span>
                            ))}
                        </div>
                        <div className="rating-text">
                            {rating !== 0 && (
                                <>
                                    {rating === 1 && <p>No lo recomiendo</p>}
                                    {rating === 2 && <p>Malo</p>}
                                    {rating === 3 && <p>Regular</p>}
                                    {rating === 4 && <p>Muy bueno</p>}
                                    {rating === 5 && <p>Excelente</p>}
                                </>
                            )}
                        </div>
                        <div className="comment-container">
                            <label htmlFor="comment" className="comment-label">Deja tus comentarios:</label>
                            <textarea id="comment" className="comment-textarea" cols="30" rows="10" value={comment} placeholder='Deja tus comentarios aquí...' onChange={handleCommentChange}></textarea>
                        </div>
                        <div className="button-container">
                            <button onClick={handleSubmit}>Enviar evaluación</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ComentsFunctionShow(props) {
    const fullStarColor = "#ffc107"; // Color para estrellas llenas
    const emptyStarColor = "#e4e5e9"; // Color para estrellas vacías
    let email_Filter = props.emailProfesor;
    console.log(email_Filter);
    const { asesor_email, comment, raiting } = props.message;
    return (
        <>
        <div className="comment-container">
            <div className="star-container">
                {[...Array(5)].map((_, index) => (
                    <span key={index} style={{ color: index < raiting ? fullStarColor : emptyStarColor }}>
                        ★
                    </span>
                ))}
            </div>
            <p className='comment-text'>{comment}</p>
        </div>
        </>
    )
}
function calculateAverageStars(params) {
    let average=0;
    for (let star = 0; star < params.length; star++) {
        average = params[star] + average; 
    }
    return average;
}

export default OnePost;