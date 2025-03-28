import { useEffect, useState } from 'react';
import './App.css';
import Image from './assets/profile-img.jpg';
import SendMessageIcon from './assets/send.png';
import Logo from './assets/background.png';
import * as socket from 'socket.io-client';

const io = socket('http://localhost:4000');

function App() {

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [openChatIndividual, setOpenChatIndividual] = useState(true);
  const [recipientId, setRecipientId] = useState("");

  
  useEffect(() => {
    io.on('users', (users) => setUsers(users));
    io.on("message", (message) => setMessages((messages) => [...messages, message]));
    io.on("privateMessage", (msg) => {setPrivateMessages((prev) => [...prev, msg]);});      
    }, []);

  const handleJoin = () =>{
    if(name){
      io.emit("join", name);
      setJoined(true);
    }
  }
 

  const handleMessage = () => {
    if(message){
      io.emit("message", {message, name});
      setMessage("");
      // if(messageRef.current){
      //   messageRef.current.focus();
      // }
    }
  }

  const handlePrivateMessage = () => {
    if (recipientId && message) {
      io.emit("privateMessage", { recipientId, message });
      setMessage("");
    }
  }


  const joinInd = () => {
     setOpenChatIndividual(!openChatIndividual);
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
            onClick={() => joinInd()} 
            key={index}
            >
              <img src={Image} className='image-profile' alt='' />
              <div className='title-chat-container' >
                <span className='title-message'>{user.name}</span>
                <span className='last-message'>
                {message.length? `${message[message.length -1].name}: ${message[message.length -1].msg}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

        { openChatIndividual && recipientId? (
        
        
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

                ):(

          
              <div className='chat-message'>
              <div className='chat-options'>
              <div className='chat-item'>
                <img src={Image} className='image-profile' alt='' />
                <div className='title-chat-container'>
                  <span className='title-message'>{name.id}</span>
                  <span className='last-message'>
                    {users.map((user, index) =>(
                        <span >{user.name}{index + 1 < users.length? ', ' : ''}</span>
                    ))}
                    </span>
                </div>
              </div>
              </div>

                <div className='chat-message-area'>
                
                    <div>
                      {privateMessages.map((msg, index) =>(
                        <div className={msg.name === name? 'user-container-message right' : 'user-container-message left'}>
                          <div className={msg.name === name? 'user-my-message' : 'user-other-message'}>
                            <span
                            // className={message.name === name? 'user-my-message' : 'user-other-message'}
                            >
                              {msg.name? `${msg.name} ` : ''}
                            </span>
                            <span className='size'
                              key={index}
                              // className={message.name === name? 'user-my-message' : 'user-other-message'}
                              >
                              {msg.message}
                            </span>
                            <div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

                <div className='chat-input-area'>
                  <input
                    className='chat-input'
                    placeholder='Mensagem'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <img src={SendMessageIcon} alt='' className='send-message-icon' onClick={() => handlePrivateMessage()} />
                </div>
              </div>


        )}

  
      </div>
    </div>




  )};


export default App;
