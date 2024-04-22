import React, { useRef, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import '../css/chat.css';

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

const Chat = () => {
    const [user] = useAuthState(auth);
    return (
        <div style={{width:'100vw', height:'100vh', overflow:'hidden'}}>
            <div className='chatcito' style={{marginTop:'3rem'}}>
                <h1>UTeMitas Chat General</h1>
                <SignOut />
                {user ? <ChatRoom /> : <SignIn />}
            </div>
        </div>
    )
}

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'), limit(25));

    const [messages] = useCollectionData(q, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await addDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <div className='todoChat'>
                {messages && messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                <span ref={dummy}></span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignContent:'end'}}>
                <form className='formChat' onSubmit={sendMessage}>
                    <input className='inputChat' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Escribe tu mensaje aquí..." />
                    <button className='enviarChat' type="submit" disabled={!formValue} style={{display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center'}} >🕊️</button>
                </form>
            </div>
        </>
    )
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <>
            <div className={`message ${messageClass}`}>
                <img className="usuariosChat"  src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='usuario' />
                <p className='mensajeChat'>{text}</p>
            </div>
        </>
    )
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            // Acceso al usuario autenticado
            const user = result.user;
            // Acceso al correo electrónico del usuario
            const email = user.email;
            console.log("Correo electrónico del usuario:", email);
        })
        .catch((error) => {
            console.error("Error al iniciar sesión con Google:", error);
        });
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

export default Chat;
