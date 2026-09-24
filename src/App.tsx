/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader.tsx';
import { WelcomeBanner } from './components/WelcomeBanner.tsx';
import { MessageItem } from './components/MessageItem.tsx';
import { ChatInput } from './components/ChatInput.tsx';
import { ChatMessage } from './types.ts';
import { ChefHat, AlertTriangle } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: userTimestamp,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicarse con el asistente.');
      }

      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newBotMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Lo siento, pero no dispongo de esa información en la base de datos proporcionada.',
        timestamp: botTimestamp,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        err?.message || 'No se pudo obtener la respuesta del asistente. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-100/50 text-stone-900 font-sans">
      <ChatHeader
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-between">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center">
            <WelcomeBanner />
          </div>
        ) : (
          <div className="flex-1 px-4 py-4 space-y-1">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 border border-stone-200/90 shadow-xs flex items-center gap-1.5 text-stone-500 text-sm">
                  <span className="text-xs font-medium text-stone-600 mr-1">Consultando documentación</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse delay-200" />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 my-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Error al procesar la solicitud</p>
                  <p className="mt-0.5 text-red-600">{errorMessage}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
      />
    </div>
  );
}
