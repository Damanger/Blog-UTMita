import React, { useRef, useState, useEffect  } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../css/chat.css';

const firebaseApp = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const Chat = () => {
    const [user] = useAuthState(auth);
    const [privateChatTabs, setPrivateChatTabs] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        if (user) {
            const fetchPrivateChatTabs = async () => {
                if (user.email === 'omar.cruzr97@gmail.com') {
                    const messagesRef = collection(firestore, 'private_messages');
                    const q = query(messagesRef, where('recipient', '==', user.email));
                    const querySnapshot = await getDocs(q);
                    const senders = new Set();
                    querySnapshot.forEach((doc) => {
                        senders.add(doc.data().sender);
                    });
                    setPrivateChatTabs(Array.from(senders));
                }
            };
            fetchPrivateChatTabs();
        }
    }, [user]);

    const handlePrevTab = () => {
        setCurrentTab((prevTab) => prevTab - 1);
    };

    const handleNextTab = () => {
        setCurrentTab((prevTab) => prevTab + 1);
    };

    return (
        <div style={{width:'100vw', height:'100vh', overflow:'hidden'}}>
            <div className='chatcito'>
                <h1>UTeMitas Chat</h1>
                <SignOut />
                {user ? 
                    <>
                        <Tabs className='chats'>
                            <TabList style={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent:'center', padding:'0' }}>
                                <Tab className='tabs' style={{ cursor: 'pointer', listStyleType: 'none' }}>Chat General</Tab>
                                {privateChatTabs.length > 2 && currentTab > 0 && (
                                    <button className="arrow-button" onClick={handlePrevTab}>‹</button>
                                )}
                                {user.email === 'omar.cruzr97@gmail.com' ? (
                                    privateChatTabs.slice(currentTab, currentTab + 2).map((sender, index) => (
                                        <Tab className='tabs' style={{ cursor: 'pointer', listStyleType: 'none' }} key={index}>Chat Privado con {sender}</Tab>
                                    ))
                                ) : (
                                    <Tab className='tabs' style={{ cursor: 'pointer', listStyleType: 'none' }}>Chat Privado con Omar</Tab>
                                )}
                                {privateChatTabs.length > 2 && currentTab < privateChatTabs.length - 2 && (
                                    <button className="arrow-button" onClick={handleNextTab}>›</button>
                                )}
                            </TabList>
                            <TabPanel>
                                <ChatRoom />
                            </TabPanel>
                            {user.email === 'omar.cruzr97@gmail.com' ? (
                                privateChatTabs.slice(currentTab, currentTab + 5).map((sender, index) => (
                                    <TabPanel key={index}>
                                        <PrivateChatRoom recipient={sender} />
                                    </TabPanel>
                                ))
                            ) : (
                                <TabPanel>
                                    <PrivateChatRoom recipient="omar.cruzr97@gmail.com" />
                                </TabPanel>
                            )}
                        </Tabs>
                    </>
                    :
                    <SignIn />
                }
            </div>
        </div>
    )
}

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'), limit(25));

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Verifica si el mensaje ya existe en el estado antes de agregarlo
            const updatedMessages = [...messages, ...newMessages.filter(newMsg => !messages.some(msg => msg.id === newMsg.id))];
            setMessages(updatedMessages);
        });

        return () => unsubscribe();
    }, [messages]);

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

function PrivateChatRoom({ recipient }) {
    const dummy = useRef();
    const messagesRef = collection(firestore, 'private_messages');

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const currentUserEmail = auth.currentUser.email;
        const sentMessagesQuery = query(messagesRef, where('sender', '==', currentUserEmail), where('recipient', '==', recipient), orderBy('createdAt', 'asc'));
        const receivedMessagesQuery = query(messagesRef, where('sender', '==', recipient), where('recipient', '==', currentUserEmail), orderBy('createdAt', 'asc'));

        const unsubscribeSent = onSnapshot(sentMessagesQuery, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(prevMessages => [...prevMessages, ...newMessages.filter(newMsg => !prevMessages.some(msg => msg.id === newMsg.id))]);
        });

        const unsubscribeReceived = onSnapshot(receivedMessagesQuery, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(prevMessages => [...prevMessages, ...newMessages.filter(newMsg => !prevMessages.some(msg => msg.id === newMsg.id))]);
        });

        return () => {
            unsubscribeSent();
            unsubscribeReceived();
        };
    }, [recipient]);

    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await addDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            photoURL,
            recipient,
            sender: auth.currentUser.email
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <div className='todoChat'>
                {messages && messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                <div ref={dummy}></div>
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
        <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Cerrar sesión</button>
    )
}

export default Chat;
