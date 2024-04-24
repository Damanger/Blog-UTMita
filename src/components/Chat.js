import React, { useRef, useState, useEffect  } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
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

PrivateChatRoom.propTypes = {
    recipient: PropTypes.string.isRequired,
};

const Chat = () => {
    const [user] = useAuthState(auth);
    const [privateChatTabs, setPrivateChatTabs] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        if (user) {
            const fetchPrivateChatTabs = async () => {
                // Verifica si el usuario actual es Omar
                if (user.email === 'omar.cruzr97@gmail.com') {
                    // Para Omar, busca los mensajes privados que recibió
                    const messagesRef = collection(firestore, 'private_messages');
                    const q = query(messagesRef, where('recipient', '==', user.email));
                    const querySnapshot = await getDocs(q);
                    const senders = new Set();
                    querySnapshot.forEach((doc) => {
                        senders.add(doc.data().sender);
                    });
                    setPrivateChatTabs(Array.from(senders));
                } else {
                    // Para otros usuarios, solo muestra la pestaña para Omar
                    setPrivateChatTabs(['omar.cruzr97@gmail.com']);
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
        <div style={{height:'100vh', width:'100vw', overflowX:'hidden'}}>
            <div className='chatcito'>
                <h1>UTeMitas Chat</h1>
                <SignOut />
                {user ? 
                    <ChatTabs
                        privateChatTabs={privateChatTabs}
                        currentTab={currentTab}
                        handlePrevTab={handlePrevTab}
                        handleNextTab={handleNextTab}
                    />
                    :<SignIn />
                }
            </div>
        </div>
    )
}

const ChatTabs = ({ privateChatTabs, currentTab, handlePrevTab, handleNextTab }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabClick = (index) => {
        setSelectedTab(index);
    };
    return (
        <Tabs className='chats'>
            <TabList style={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'center', padding: '0' }}>
                <Tab className={`tabs ${selectedTab === 0 ? 'selected-tab' : ''}`} style={{ cursor: 'pointer', listStyleType: 'none' }} onClick={() => handleTabClick(0)}>Chat General</Tab>
                {privateChatTabs.length > 2 && currentTab > 0 && (
                    <button className="arrow-button" onClick={handlePrevTab}>‹</button>
                )}
                {privateChatTabs.map((sender, index) => (
                    <Tab className={`tabs ${selectedTab === index + 1 ? 'selected-tab' : ''}`} style={{ cursor: 'pointer', listStyleType: 'none' }} key={index} onClick={() => handleTabClick(index + 1)}>{sender}</Tab>
                ))}
                {privateChatTabs.length > 2 && currentTab < privateChatTabs.length - 2 && (
                    <button className="arrow-button" onClick={handleNextTab}>›</button>
                )}
            </TabList>
            <TabPanel>
                <ChatRoom />
            </TabPanel>
            {privateChatTabs.slice(currentTab, currentTab + 5).map((sender, index) => (
                <TabPanel key={index}>
                    <PrivateChatRoom recipient={sender} />
                </TabPanel>
            ))}
        </Tabs>
    );
};

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'), limit(25));

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Agrega los nuevos mensajes al principio del array de mensajes
            setMessages(prevMessages => [...newMessages, ...prevMessages]);
        });
    
        return () => unsubscribe();
    }, []);    

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
    const [messages, setMessages] = useState([]);
    const currentUserEmail = auth.currentUser.email;
    const messagesRef = collection(firestore, 'private_messages');
    const dummy = useRef();

    useEffect(() => {
        const sentMessagesQuery = query(messagesRef, where('sender', '==', currentUserEmail), where('recipient', '==', recipient), orderBy('createdAt', 'asc'));
        const receivedMessagesQuery = query(messagesRef, where('sender', '==', recipient), where('recipient', '==', currentUserEmail), orderBy('createdAt', 'asc'));

        const unsubscribeSent = onSnapshot(sentMessagesQuery, (snapshot) => {
            const newSentMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), sentByCurrentUser: true }));
            setMessages(prevMessages => [...prevMessages.filter(msg => msg.sender !== currentUserEmail), ...newSentMessages]);
        });

        const unsubscribeReceived = onSnapshot(receivedMessagesQuery, (snapshot) => {
            const newReceivedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), sentByCurrentUser: false }));
            setMessages(prevMessages => [...prevMessages.filter(msg => msg.sender !== recipient), ...newReceivedMessages]);
        });

        return () => {
            unsubscribeSent();
            unsubscribeReceived();
        };
    }, [currentUserEmail, recipient, messagesRef]);

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

    const handleNewMessage = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    return (
        <>
            <div className='todoChat'>
                {messages.filter(msg => msg.createdAt).sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()).map((msg, index) => <ChatMessage key={index} message={msg} />)}
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
    // Check if props.message is truthy
    if (!props.message) {
        // Return null or some fallback UI
        return null;
    }

    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <>
            <div className={`message ${messageClass}`}>
                <img className="usuariosChat" src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='usuario' />
                <p className='mensajeChat'>{text}</p>
            </div>
        </>
    );
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
            console.log("Correo electrónico del usuario: ", email);
        })
        .catch((error) => {
            console.error("Error al iniciar sesión con Google: ", error);
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
