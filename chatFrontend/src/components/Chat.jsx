import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Chat = ({ messages, username }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 space-y-reverse overflow-y-auto h-[700px] p-4 border rounded-lg">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.user === username ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`p-4 rounded-lg max-w-xs ${
              message.user === username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            <div className="font-bold">{message.user}</div>
            {message.text && <div>{message.text}</div>}
            {message.image && <img src={message.image} alt="uploaded" className="mt-2" />}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      text: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
  username: PropTypes.string.isRequired,
};

export default Chat;