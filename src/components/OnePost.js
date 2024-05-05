import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../client';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp, where, onSnapshot } from 'firebase/firestore';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';
import { faWeixin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../css/OnePost.css';
import { set } from 'date-fns';

const firebaseApp = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

const firestore = getFirestore(firebaseApp);


const builder = imageUrlBuilder(sanityClient);

const urlFor = (source) => {
    return builder.image(source);
}  

function calculateAverageStars(ratings) {
    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const average = sum / ratings.length;
    return average;
}
const OnePost = () => {
    const [captcha, setCaptcha] = useState(null);
    const [postData, setPostData] = useState(null);
    const [showLoader, setShowLoader] = useState(true);
    const { slug } = useParams();
    const [firstBio, setFirstBio] = useState('');
    const [secondBio, setSecondBio] = useState('');
    const [thirdBio, setThirdBio] = useState('');
    const [fourhtBio, setFourhtBio] = useState('');
    const [fifthBio, setFifthBio] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const dummy = useRef();
    const comentsRef = collection(firestore, 'coments');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: null,
        key: 'selection'
    }]);

    const [coments, setComents] = useState([]); // Inicializa el estado para los comentarios

    useEffect(() => {
        const q = query(comentsRef, orderBy('createdAt'), limit(25), where('asesor_email', '==', secondBio));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const comments = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setComents(comments);
        });
    
        // Limpia la suscripción al desmontar el componente
        return () => unsubscribe();
    }, [secondBio]);

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
                setFifthBio(bioArray[4]);
            }else{
                console.error('No se encontró la bio');
            }
        })
        .catch(err => console.error(err));
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

    const handleCaptcha = value => {
        setCaptcha(value);
    };

    const handleModalClick = (event) => {
        if (event.target.classList.contains('modal-comentarios')) {
            closeModal();
        }
    };

    const sendComment = async (e) => {

        if (!comment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, completa el campo',
                text: 'Para enviar el formulario, necesitas completar el captcha.',
            });
            return;
        }
        if (!captcha) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, completa el captcha',
                text: 'Para enviar el formulario, necesitas completar el captcha.',
            });
            return; // Detiene la ejecución de la función si el captcha no está completo
        }
        const docRef = await addDoc(comentsRef, {
            comment: comment,
            raiting: rating,
            asesor_email: secondBio,
            createdAt: serverTimestamp(),
        });
    
        // Agrega el nuevo comentario al estado local sin intentar obtener los datos del documento
        setComents(prevComents => [...prevComents, {
            id: docRef.id,
            comment: comment,
            raiting: rating,
            asesor_email: secondBio,
            createdAt: serverTimestamp(),
        }]);
    }    
    

    const handleSubmit = () => {
        sendComment();
        setComment('');
        setRating(0);
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
        // Obtener un array de todas las calificaciones de los comentarios
    const ratingsArray = coments.map(comment => comment.raiting);

        // Calcular el rating promedio
    const averageRating = calculateAverageStars(ratingsArray);

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
                    <span>Calificación general:</span>
                    <div className="star-container">
                        {[...Array(5)].map((_, index) => (
                            <span key={index} className={index < averageRating ? 'star filled' : 'star'}>
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="rating-text">
                        {averageRating !== 0 && (
                            <>
                                {averageRating === 1 && <span>No recomendado</span>}
                                {averageRating === 2 && <span>Malo</span>}
                                {averageRating === 3 && <span>Regular</span>}
                                {averageRating === 4 && <span>Muy bueno</span>}
                                {averageRating === 5 && <span>Excelente</span>}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="ss">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h2><span style={{color:"#18b495"}}>${thirdBio}</span> / hora</h2>
                    <h3 style={{marginTop:'-1rem'}}>Horarios: {fourhtBio}</h3>
                    <button style={{marginBottom:'0.5rem'}} onClick={handleToggleDatePicker}>
                        {showDatePicker ? 'Ocultar Calendario' : 'Mostrar Calendario'}
                    </button>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <a href={`https://www.paypal.me/${fifthBio}/${thirdBio}`} target="_blank" rel="noreferrer">
                        <button>Pagar ${thirdBio}Mxn</button>
                    </a>
                </div>
                </div>
                <div style={{display:'flex', justifyContent:'center'}} className={`DateRangePickerContainer ${showDatePicker ? 'active' : ''}`}>
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
                            <textarea id="comment" className="comment-textarea" cols="30" rows="10" value={comment} placeholder='Deja tus comentarios aquí...' maxLength={150} minLength={20} onChange={handleCommentChange}></textarea>
                        </div>
                        <div className='captcha-container'>
                                        <ReCAPTCHA sitekey="6LcFb7YpAAAAAKMGk7zzrJkOXMQUvNPdoB4JlMnS" onChange={handleCaptcha} />
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
    const { asesor_email, comment, raiting } = props.message;
    if (asesor_email !== email_Filter) {
        return null;
    }
    return (
        <>
        <div className="comment-container">
            <div className="star-container-coment">
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


export default OnePost;