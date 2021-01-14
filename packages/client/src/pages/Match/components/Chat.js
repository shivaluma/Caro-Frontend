export default function Chat({ messages }) {
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
          </div>
        </div>
      </div>
    </div>
  );
}
