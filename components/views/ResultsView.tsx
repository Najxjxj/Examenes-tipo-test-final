
import React from 'react';
import { 
  RefreshCw, 
  Download, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Clock,
  Zap,
  ChevronDown
} from 'lucide-react';
import { ExamSession } from '../../types';

interface ResultsViewProps {
  session: ExamSession;
  onRetry: () => void;
  onNew: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onRetry, onNew }) => {
  const correctCount = session.questions.filter(q => q.isCorrect).length;
  const incorrectCount = session.totalQuestions - correctCount;
  
  const formatTime = (s: number = 0) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}m ${sec}s`;
  };

  const pace = session.timeElapsed ? Math.round(session.timeElapsed / session.totalQuestions) : 0;
  
  // Calculamos el porcentaje para el gráfico circular
  const scorePercentage = (session.score / session.totalQuestions) * 100;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
      {/* Sidebar de Resumen */}
      <aside className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-dark rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
            <CheckCircle2 size={300} />
          </div>
          
          <h2 className="text-xl font-black text-white mb-8">Puntuación Final</h2>

          <div className="flex flex-col items-center mb-10">
            <div className="relative size-48">
              <svg className="size-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="15.9155" fill="none" 
                  stroke="#137fec" strokeWidth="3" 
                  strokeDasharray={`${scorePercentage}, 100`}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_12px_rgba(19,127,236,0.8)] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white leading-none">{session.score}</span>
                <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-2">Respuestas</span>
              </div>
            </div>
            <p className="mt-4 text-white/30 font-bold uppercase tracking-widest text-[10px]">De un total de {session.totalQuestions}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 text-center">
              <Clock size={20} className="mx-auto text-primary mb-2" />
              <p className="text-[10px] font-black text-white/40 uppercase mb-1">Tiempo Total</p>
              <p className="text-lg font-black text-white">{formatTime(session.timeElapsed)}</p>
            </div>
            <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 text-center">
              <Zap size={20} className="mx-auto text-warning mb-2" />
              <p className="text-[10px] font-black text-white/40 uppercase mb-1">Ritmo</p>
              <p className="text-lg font-black text-white">{pace}s / preg</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onRetry}
              className="w-full bg-primary hover:bg-primary-dark text-white h-14 font-black rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-3 transition-all"
            >
              <RefreshCw size={20} /> Repetir Test
            </button>
            <button 
              onClick={onNew}
              className="w-full bg-white/5 hover:bg-white/10 text-white h-14 font-black rounded-2xl flex items-center justify-center gap-3 transition-all"
            >
              <PlusCircle size={20} /> Nuevo Material
            </button>
          </div>
        </div>
      </aside>

      {/* Revisión de Preguntas */}
      <section className="lg:col-span-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h3 className="text-2xl font-black text-white">Análisis de Errores</h3>
          <div className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold text-white/60">
            {correctCount} correctas de {session.totalQuestions}
          </div>
        </div>

        <div className="space-y-6">
          {session.questions.map((q, idx) => (
            <div key={q.id} className={`bg-surface-dark border-l-4 rounded-3xl overflow-hidden shadow-xl transition-all hover:scale-[1.01] ${
              q.isCorrect ? 'border-success' : 'border-danger'
            }`}>
              <div className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className={`shrink-0 size-12 rounded-2xl flex items-center justify-center border-2 ${
                    q.isCorrect ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
                  }`}>
                    {q.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1 block">Pregunta {idx + 1}</span>
                    <h4 className="text-xl font-bold text-white leading-snug">{q.text}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-18 mb-8">
                  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-2">Tu respuesta</p>
                    <p className={`font-bold ${q.isCorrect ? 'text-success' : 'text-danger'}`}>{q.userAnswer || 'No respondida'}</p>
                  </div>
                  {!q.isCorrect && (
                    <div className="bg-success/5 p-5 rounded-2xl border border-success/10">
                      <p className="text-[10px] font-black text-success uppercase mb-2">Respuesta Correcta</p>
                      <p className="font-bold text-success">{q.correctAnswer}</p>
                    </div>
                  )}
                </div>

                <div className="ml-0 md:ml-18 bg-background-dark/50 p-6 rounded-2xl border border-white/5">
                  <div className="flex gap-4">
                    <div className="p-2 bg-primary/20 text-primary rounded-xl h-fit shadow-inner"><Lightbulb size={18} /></div>
                    <div>
                      <h5 className="text-[10px] font-black text-primary uppercase mb-3 tracking-widest">Feedback Pedagógico</h5>
                      <div className="text-sm text-white/60 leading-relaxed space-y-2 text-justify">
                        <p>{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultsView;
