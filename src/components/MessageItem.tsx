import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ChefHat, User, Copy, Check, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types.ts';

interface MessageItemProps {
  message: ChatMessage;
}

const STRICT_FALLBACK_PHRASE = "Lo siento, pero no dispongo de esa información en la base de datos proporcionada.";

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const isExactFallback = message.content.trim() === STRICT_FALLBACK_PHRASE;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`flex items-start gap-3 py-3.5 transition-opacity ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
          isUser
            ? 'bg-stone-800 text-stone-100'
            : isExactFallback
            ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-amber-600 text-white shadow-xs'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : isExactFallback ? (
          <AlertCircle className="w-4 h-4 text-amber-700" />
        ) : (
          <ChefHat className="w-4 h-4" />
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group ${
          isUser
            ? 'bg-stone-900 text-stone-100 rounded-tr-xs shadow-xs'
            : isExactFallback
            ? 'bg-amber-50/90 text-amber-950 border border-amber-200/90 rounded-tl-xs'
            : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs shadow-xs'
        }`}
      >
        {/* Out-of-bounds badge if fallback triggered */}
        {!isUser && isExactFallback && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700 mb-1.5 pb-1 border-b border-amber-200/60">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Respuesta estricta: Información no presente en el documento</span>
          </div>
        )}

        {/* Content */}
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-stone prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:my-2 prose-headings:font-semibold">
            <Markdown>{message.content}</Markdown>
          </div>
        )}

        {/* Footer info & actions */}
        <div
          className={`flex items-center justify-between gap-3 mt-2 text-[11px] pt-1 border-t ${
            isUser
              ? 'border-stone-800 text-stone-400'
              : 'border-stone-100 text-stone-400'
          }`}
        >
          <span>{message.timestamp}</span>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
              title="Copiar respuesta"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
