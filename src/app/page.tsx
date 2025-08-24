'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, clearError } = useChat();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => {
        closeErrorMessage()
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [error]);

  const closeErrorMessage = () => {
    setShowToast(false);
     clearError()
  }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}
      {error && showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-red-600 text-white rounded-lg shadow-xl z-50 flex items-center space-x-4">
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error.message}</p>
          </div>
          <button
            onClick={closeErrorMessage}
            className="p-1 rounded-full text-white hover:bg-red-700 transition-colors duration-200"
          >
            <IoCloseSharp size={20} />
          </button>
        </div>
      )}
      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder={status === 'submitted'? 'Loading' : status === 'error' ? ' Oops you have an error, try again': 'Ask something'}
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}