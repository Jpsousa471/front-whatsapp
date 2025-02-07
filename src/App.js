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
  const [chatIndividual, setChatIndividual] = useState({});
  const [openChatIndividual, setOpenChatIndividual] = useState(true);
  const messageRef = useRef(null);

  
  // const getEnterKey = () =>{
  //   if(e.key === 'Enter') {
  //     handleMessage();
  //   }
  // }

  useEffect(() =>{
    io.on("users", (users) => setUsers(users));
    io.on("message", (message) => setMessages((messages) => [...messages, message]));
    io.on("joinIndividual", (userId) => {setChatIndividual({userId, messages: [] })});
    io.on('messageIndividual', (message) => {
      setChatIndividual((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, message],
      }));
    });
  }, [])

  const handleJoin = () =>{
    if(name){
      io.emit("join", name);
      setJoined(true);
    }
  }

  const handleMessage = () =>{
    if(message){
      io.emit("message", {message, name});
      setMessage("");
      if(messageRef.current){
        messageRef.current.focus();
      }
    }

  }

  // const handleJoinIndividual = (userId) => {
  //   io.emit('joinIndividual', userId);
  // };

  // const handleMessageIndividual = () => {
  //   if (message) {
  //     io.emit('messageIndividual', message, chatIndividual.userId);
  //     setMessage('');
  //   }
  // };


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
          {/* <div className='chat-item'>
            <img src={Image} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>Grupo de degenerádos</span>
              <span className='last-message'>
                {messages.length? `${messages[messages.length -1].name}: ${messages[messages.length -1].message}` : ''}
              </span>
            </div>
          </div> */}

          {users.map((user, index) => (
            <div className='chat-item'
            key={index}
            >
              <img src={Image} className='image-profile' alt='' />
              <div className='title-chat-container' onClick={setOpenChatIndividual(!openChatIndividual)}>
                <span className='title-message'>{user.name}</span>
                <span className='last-message'>
                  {messages.length? `${messages[messages.length -1].name}: ${messages[messages.length -1].message}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
        
          {
            chatIndividual? 

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
            />
            <img src={SendMessageIcon} alt='' className='send-message-icon' onClick={() => handleMessage()} />
          </div>
        </div>

        :
    
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
          />
          <img src={SendMessageIcon} alt='' className='send-message-icon' onClick={() => handleMessage()} />
        </div>
      </div>

          }


      </div>
    </div>
  );
}

export default App;
