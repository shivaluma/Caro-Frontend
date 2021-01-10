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
    <div className="flex flex-col h-full max-h-full overflow-hidden rounded-t-lg">
      <div className="relative flex flex-col flex-1 bg-gray-100 chat-history">
        <div className="absolute top-0 bottom-0 left-0 right-0">
          <div className="flex flex-col w-full h-full p-2 overflow-y-auto">
            {messages.map((message, index) => (
              <span key={index} className="p-1 font-medium">
                {message.sender} :{' '}
                <span className="text-sm font-normal text-gray-600"> {message.content}</span>
              </span>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>

      <form className="chat-message" onSubmit={handleSendMessage}>
        <input
          className="w-full px-4 py-2 bg-gray-300 border rounded-b-lg focus:outline-none"
          onChange={handleInput}
          value={currentValue}
          name="message-to-send"
          id="message-to-send"
          placeholder="Type your message"
          rows="2"
        />

        {/* <button className="p-1" type="submit">
          Send
        </button> */}
      </form>
    </div>
  );
}
