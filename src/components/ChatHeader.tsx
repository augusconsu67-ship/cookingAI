import React from 'react';
import { ChefHat, RotateCcw, Lock, CheckCircle2 } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, messageCount }) => {
  return (
    <header className="border-b border-stone-200 bg-stone-50/90 backdrop-blur-md sticky top-0 z-20 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm ring-1 ring-amber-700/20">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-stone-900 tracking-tight">
                Asistente Virtual de Recetas
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Modo Estricto
              </span>
            </div>
            <p className="text-xs text-stone-500 line-clamp-1">
              Respuestas basadas únicamente en la documentación de recetas autorizada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>DB protegida</span>
          </div>

          {messageCount > 0 && (
            <button
              id="clear-chat-btn"
              onClick={onClearChat}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors cursor-pointer"
              title="Reiniciar conversación"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
