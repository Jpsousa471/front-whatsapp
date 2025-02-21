import { useEffect, useRef, useState } from 'react';
import './App.css';
import Image from './assets/profissao-programador-logo.jpg';
import SendMessageIcon from './assets/send.png';
import Logo from './assets/whatsapp.png';
import socket from 'socket.io-client';

const io = socket('http://localhost:4000');

function App() {

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageIndividual, setMessageIndividual] = useState("");
  const [chats, setChats] = useState({});
  const [openChatIndividual, setOpenChatIndividual] = useState(true);
  const messageRef = useRef(null);



  // const getEnterKey = () =>{
  //   if(e.key === 'Enter') {
  //     handleMessage();
  //   }
  // }

  useEffect(() => {
    io.on('users', (users) => setUsers(users));
    io.on("message", (message) => setMessages((messages) => [...messages, message]));
    io.on('joinIndividual', (userId) => {setChats({ userId, messages: [] });});
    io.on('messageIndividual', (messageIndividual) => setChats((prevChat) => [...prevChat, messageIndividual]));
  }, []);

  const handleJoin = () =>{
    if(name){
      io.emit("join", name);
      setJoined(true);
    }
  }
  console.log(name)

  const handleMessage = () => {
    if(message){
      io.emit("message", {message, name});
      setMessage("");
      // if(messageRef.current){
      //   messageRef.current.focus();
      // }
    }

  }


  // const handleChatIndividual = (user) =>{
  //   if(users) {
  //     io.emit("joinIndividual", userId);
  //     setChats({userId: user.id, messageIndividual: []});
  //     setOpenChatIndividual(false);

  //   }
  // }
  const handleJoinIndividual = (userId) => {
    io.emit('joinIndividual', userId);
    setOpenChatIndividual(false);
  };

  const handleMessageIndividual = () => {
    if (messageIndividual) {
      io.emit("messageIndividual", messageIndividual, chats.userId);
      setMessageIndividual("");
    }
  };


  if(!joined){
    return (
      <div className='box-master'>
        <div className='box'>
          <img id='logo' alt='' src={Logo}/>
          <span id='text'>Digite sue nome</span>
          <input id='input' value={name} onChange={(e) => setName(e.target.value)} />
          <button id='click' onClick={() => handleJoin()}>Entrar</button>
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='back-ground'></div>
      <div className='chat-container'>


        <div className='chat-contacts'>
          <div className='chat-options'></div>
            <div className='chat-item' onClick={() => setOpenChatIndividual(true)}>
            <img src={Image} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>Grupo de degenerádos</span>
              <span className='last-message'>
                {messages.length? `${messages[messages.length -1].name}: ${messages[messages.length -1].message}` : ''}
              </span>
            </div>
          </div> 



          {users.map((user, index) => (
            <div className='chat-item' 
            onClick={() => handleJoinIndividual(user.id)} 
            key={index}
            >
              <img src={Image} className='image-profile' alt='' />
              <div className='title-chat-container' >
                <span className='title-message'> falar com:{user.name}</span>
                <span className='last-message'>
                  {users.length? `${users[users.length -1].name}: ${users[users.length -1].messageIndividual}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

     { openChatIndividual ? (
     
    
            <div className='chat-message'>
          <div className='chat-options'>
          <div className='chat-item'>
            <img src={Image} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>Grupo de degenerádos</span>
              <span className='last-message'>
                {users.map((user, index) =>(
                    <span>{user.name}{index + 1 < users.length? ', ' : ''}</span>
                ))}
                </span>
            </div>
          </div>
          </div>

          <div className='chat-message-area'>
              {messages.map((message, index) =>(
                <div className={message.name === name? 'user-container-message right' : 'user-container-message left'}>
                  <div className={message.name === name? 'user-my-message' : 'user-other-message'}>
                    <span
                    // className={message.name === name? 'user-my-message' : 'user-other-message'}
                    >
                      {message.name? `${message.name} ` : ''}
                    </span>
                    <span className='size'
                      key={index}
                      // className={message.name === name? 'user-my-message' : 'user-other-message'}
                      >
                      {message.message}
                    </span>
                    <div></div>
                  </div>
                </div>
              ))}
          </div>

          <div className='chat-input-area'>
            <input
              className='chat-input'
              placeholder='Mensagem'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={messageRef}
            />
            <img src={SendMessageIcon} alt='' className='send-message-icon' onClick={() => handleMessage()} />
          </div>
        </div>

            ):(

      
          <div className='chat-message'>
          <div className='chat-options'>
          <div className='chat-item'>
            <img src={Image} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>{users.name}</span>
              <span className='last-message'>
                {users.map((user, index) =>(
                    <span>{user.name}{index + 1 < users.length? ', ' : ''}</span>
                ))}
                </span>
            </div>
          </div>
          </div>

            <div className='chat-message-area'>
              {chats.userId && (
                <div>
                  {chats.messageIndividual.map((messageIndividual, index) =>(
                    <div className={messageIndividual.userId === name? 'user-container-message right' : 'user-container-message left'}>
                      <div className={messageIndividual.userId === name? 'user-my-message' : 'user-other-message'}>
                        <span
                        // className={message.name === name? 'user-my-message' : 'user-other-message'}
                        >
                          {messageIndividual.userId? `${messageIndividual.userId} ` : ''}
                        </span>
                        <span className='size'
                          key={index}
                          // className={message.name === name? 'user-my-message' : 'user-other-message'}
                          >
                          {messageIndividual.messageIndividual}
                        </span>
                        <div></div>
                      </div>
                    </div>
                  ))}
                  {console.log(chats)}
                </div>
              )}
            </div>

            <div className='chat-input-area'>
              <input
                className='chat-input'
                placeholder='Mensagem'
                value={messageIndividual}
                onChange={(e) => setMessageIndividual(e.target.value)}
              />
              <img src={SendMessageIcon} alt='' className='send-message-icon' onClick={() => handleMessageIndividual()} />
            </div>
          </div>
    )}

    
       

      </div>
    </div>
  )

 }



export default App;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { useEffect, useRef, useState } from 'react';
// import './App.css';
// import Image from './assets/profissao-programador-logo.jpg';
// import SendMessageIcon from './assets/send.png';
// import Logo from './assets/whatsapp.png';
// import socket from 'socket.io-client';

// const io = socket('http://localhost:4000');

// function App() {
//   const [name, setName] = useState('');
//   const [joined, setJoined] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [chatIndividual, setChatIndividual] = useState({});
//   const [message, setMessage] = useState('');
//   const messageRef = useRef(null);

//   useEffect(() => {
//     io.on('users', (users) => setUsers(users));
//     io.on('joinIndividual', (userId) => {
//       setChatIndividual({ userId, messages: [] });
//     });
//     io.on('messageIndividual', (message) => {
//       setChatIndividual((prevChat) => ({
//         ...prevChat,
//         messages: [...prevChat.messages, message],
//       }));
//     });
//   }, []);

//   const handleJoin = () => {
//     if (name) {
//       io.emit('join', name);
//       setJoined(true);
//     }
//   };

//   const handleJoinIndividual = (userId) => {
//     io.emit('joinIndividual', userId);
//   };

//   const handleMessageIndividual = () => {
//     if (message) {
//       io.emit('messageIndividual', message, chatIndividual.userId);
//       setMessage('');
//     }
//   };

//   return (
//     <div>
//       {joined ? (
//         <div>
//           <h1>Chat Individual</h1>
//           <ul>
//             {users.map((user) => (
//               <li key={user.id}>
//                 <button onClick={() => handleJoinIndividual(user.id)}>
//                   Iniciar chat individual com {user.name}
//                 </button>
//               </li>
//             ))}
//           </ul>
//           {chatIndividual.userId && (
//             <div>
//               <h2>Chat com {users.find((user) => user.id === chatIndividual.userId).name}</h2>
//               <ul>
//                 {chatIndividual.messages.map((message, index) => (
//                   <li key={index}>{message}</li>
//                 ))}
//               </ul>
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Digite uma mensagem"
//               />
//               <button onClick={handleMessageIndividual}>Enviar</button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div>
//           <h1>Entre com seu nome</h1>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Digite seu nome"
//           />
//           <button onClick={handleJoin}>Entrar</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
