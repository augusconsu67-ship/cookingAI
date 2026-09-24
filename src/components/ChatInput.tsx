import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-stone-200 bg-stone-50/95 backdrop-blur-md p-3 sm:p-4 sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end bg-white rounded-2xl border border-stone-300 focus-within:border-stone-500 focus-within:ring-2 focus-within:ring-stone-400/20 shadow-xs transition-all">
          <textarea
            id="chat-input-textarea"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Escribe tu consulta sobre las recetas (ej. ingredientes, pasos, tiempos)..."
            className="w-full resize-none py-3 pl-4 pr-12 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none max-h-36 min-h-[44px]"
          />

          <div className="absolute right-2 bottom-1.5 flex items-center">
            <button
              id="send-message-btn"
              type="button"
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer'
                  : 'bg-stone-100 text-stone-300 cursor-not-allowed'
              }`}
              title="Enviar consulta"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 px-2">
          <span>Pulsa Enter para enviar • Shift + Enter para salto de línea</span>
          <span className="hidden sm:inline">Respuestas estrictas basadas en texto oficial</span>
        </div>
      </div>
    </div>
  );
};
