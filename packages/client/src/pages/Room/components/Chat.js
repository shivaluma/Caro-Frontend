import { useState } from 'react';

export default function Chat({ messages, onMessageSend, endRef }) {
  const [currentValue, setCurrentValue] = useState('');

  const handleSendMessage = (event) => {
    event.preventDefault();
    const value = currentValue;
    console.log(value.trim());
    if (!value.trim()) return;
    onMessageSend(value.trim());
    setCurrentValue('');
  };

  const handleInput = (event) => {
    setCurrentValue(event.target.value);
  };

  return (
    <div className="h-full chat">
      <div className="flex flex-col chat-history">
        {messages.map((message, index) => (
          <span key={index} className="mb-3 font-medium">
            {message.sender} :{' '}
            <span className="text-sm font-normal text-gray-600"> {message.content}</span>
          </span>
        ))}

        <div ref={endRef} />
      </div>

      <form className="clearfix chat-message" onSubmit={handleSendMessage}>
        <input
          className="px-4 py-2 rounded-md"
          onChange={handleInput}
          value={currentValue}
          name="message-to-send"
          id="message-to-send"
          placeholder="Type your message"
          rows="2"
        />

        <button className="p-1" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
