import React, { useRef, useState, useEffect  } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
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

PrivateChatRoom.propTypes = {
    recipient: PropTypes.string.isRequired,
};

const Chat = () => {
    const [user] = useAuthState(auth);
    const [privateChatTabs, setPrivateChatTabs] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        const professorEmails = [
            'curo970902@gs.utm.mx', 'sarl021022@gs.utm.mx', 'rore021226@gs.utm.mx', 
            'vaaa020526@gs.utm.mx', 'lolf020610@gs.utm.mx', 'aupj021014@gs.utm.mx', 
            'socr010910@gs.utm.mx', 'oirj030920@gs.utm.mx', 'gaha020310@gs.utm.mx', 
            'macv990326@gs.utm.mx', 'gaod000203@gs.utm.mx', 'caue981007@gs.utm.mx',
            'sagl981027@gs.utm.mx', 'vazj011224@gs.utm.mx'
        ];
    
        const fetchPrivateChatTabs = async () => {
            if (user && professorEmails.includes(user.email)) {
                const messagesRef = collection(firestore, 'private_messages');
                const q = query(messagesRef, where('recipient', '==', user.email));
                const querySnapshot = await getDocs(q);
                const senders = new Set();
                querySnapshot.forEach((doc) => {
                    senders.add(doc.data().sender);
                });
                setPrivateChatTabs(Array.from(senders));
            } else {
                setPrivateChatTabs(professorEmails);
            }
        };
    
        fetchPrivateChatTabs();
    }, [user]);
    
    const handlePrevTab = () => {
        setCurrentTab((prevTab) => Math.max(prevTab - 1, 0));
    };
    
    const handleNextTab = () => {
        setCurrentTab((prevTab) => Math.min(prevTab + 1, privateChatTabs.length - 2));
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
                {privateChatTabs.slice(currentTab, currentTab + 1).map((sender, index) => (
                    <Tab className={`tabs private-tab ${selectedTab === currentTab + index + 1 ? 'selected-tab' : ''}`} style={{ cursor: 'pointer', listStyleType: 'none' }} key={index} onClick={() => handleTabClick(currentTab + index + 1)}>{sender}</Tab>
                ))}
                {privateChatTabs.length > 1 && currentTab < privateChatTabs.length - 1 && (
                    <button className="arrow-button" onClick={handleNextTab}>›</button>
                )}
            </TabList>
            <TabPanel>
                <ChatRoom />
            </TabPanel>
            {privateChatTabs.slice(currentTab, currentTab + 2).map((sender, index) => (
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
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(25)); // Ordenar los mensajes por fecha ascendente
    const ChatMessageMemo = React.memo(ChatMessage);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docChanges().map(change => {
                if (change.type === 'added') {
                    return { id: change.doc.id, ...change.doc.data() };
                }
                return null;
            }).filter(message => message !== null);

            setMessages(prevMessages => [...prevMessages, ...newMessages]);
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
                {messages.map((msg, index) => <ChatMessageMemo key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'end' }}>
                <form className='formChat' onSubmit={sendMessage}>
                    <input className='inputChat' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Escribe tu mensaje aquí..." />
                    <button className='enviarChat' type="submit" disabled={!formValue} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} >🕊️</button>
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
        const messagesRef = collection(firestore, 'private_messages');
        const querySentReceived = query(messagesRef, where('sender', 'in', [currentUserEmail, recipient]), where('recipient', 'in', [currentUserEmail, recipient]), orderBy('createdAt', 'asc'));
    
        const unsubscribe = onSnapshot(querySentReceived, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), sentByCurrentUser: doc.data().sender === currentUserEmail }));
            setMessages(newMessages);
        });
    
        return () => unsubscribe();
    }, [currentUserEmail, recipient, firestore]);

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
