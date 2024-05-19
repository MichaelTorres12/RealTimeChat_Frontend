import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Chat from './components/Chat';
import './App.css';

const socket = io('https://real-time-chat-backend.vercel.app/');

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [inChat, setInChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (inChat) {
      socket.on('message', (message) => {
        if (message.history) {
          setMessages(message.history);
        } else {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.off('message');
      };
    }
  }, [inChat]);

  const joinRoom = () => {
    if (username && room) {
      socket.emit('joinRoom', { username, room });
      setInChat(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('https://real-time-chat-backend.vercel.app/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      socket.emit('image', res.data.imageUrl);
    } catch (err) {
      console.error('Error al subir la imagen', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!inChat ? (
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl mb-4">Bienvenido al Chat</h1>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Número de sala"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button onClick={joinRoom} className="bg-blue-500 text-white p-2 rounded w-full">
            Unirse a la Sala
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg p-4">
          <h1 className="text-xl mb-4">Sala {room}</h1>
          <Chat messages={messages} username={username} />
          <div className="mt-4 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border p-2 flex-grow mr-2 text-xl w-[100%]"
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded text-xl">
              Enviar
            </button>
            <input type="file" onChange={handleImageUpload} className="ml-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
