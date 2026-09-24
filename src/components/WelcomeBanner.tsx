import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
              Asistente Virtual de Recetas
            </h2>
            <p className="text-xs text-stone-500">
              Consultas directas basadas de manera exclusiva y estricta en la documentación
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">
          Estoy a tu disposición para resolver cualquier pregunta sobre las recetas contenidas en la documentación oficial. Por favor, escribe tu consulta en el cuadro inferior.
        </p>

        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Reglas de funcionamiento
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Responde únicamente utilizando la información explícita de los documentos de recetas.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Si lo consultado no se encuentra en el documento, la respuesta será exactamente:{' '}
                <strong className="block mt-1 font-mono text-xs bg-stone-200/80 text-stone-800 p-2 rounded-lg border border-stone-300">
                  "Lo siento, pero no dispongo de esa información en la base de datos proporcionada."
                </strong>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Sin conocimientos externos ni suposiciones fuera del texto brindado.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Acceso restringido al archivo de base de datos en bruto.</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
          <MessageSquare className="w-4 h-4 text-stone-400" />
          <span>Escribe tu pregunta a continuación para comenzar.</span>
        </div>
      </div>
    </div>
  );
};
