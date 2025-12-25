
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, HelpCircle, School, Clock } from 'lucide-react';
import { ExamSession } from '../../types';

interface ExamModeViewProps {
  session: ExamSession;
  onFinish: (session: ExamSession) => void;
}

const ExamModeView: React.FC<ExamModeViewProps> = ({ session, onFinish }) => {
  const [time, setTime] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    const finalQuestions = session.questions.map(q => ({
      ...q,
      userAnswer: answers[q.id],
      isCorrect: answers[q.id] === q.correctAnswer
    }));
    const correctCount = finalQuestions.filter(q => q.isCorrect).length;
    
    onFinish({
      ...session,
      questions: finalQuestions,
      score: correctCount, // 1 punto por respuesta correcta
      timeElapsed: time
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / session.totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header Sticky con Tiempo Transcurrido */}
      <div className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-2xl border-b border-white/5 -mx-8 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <School size={14} /> Prueba Oficial
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{session.topic}</h1>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-background-dark border border-white/10 rounded-2xl shadow-inner">
            <Clock size={20} className="text-primary animate-pulse" />
            <span className="text-white font-mono text-xl font-black">{formatTime(time)}</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-end gap-2">
              <span className="text-white font-black text-2xl leading-none">{answeredCount}</span>
              <span className="text-white/20 text-xs font-bold pb-0.5">/ {session.totalQuestions}</span>
            </div>
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary shadow-[0_0_10px_rgba(19,127,236,0.6)] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12 py-6">
        {session.questions.map((q, idx) => (
          <div key={q.id} className="group bg-surface-dark p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all shadow-2xl">
            <div className="flex items-start gap-6 mb-10">
              <div className="flex-shrink-0 flex items-center justify-center size-12 rounded-2xl bg-background-dark text-primary font-black text-xl border border-white/5 shadow-inner">
                {idx + 1}
              </div>
              <h3 className="text-2xl font-black leading-tight text-white pt-1">
                {q.text}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 ml-0 md:ml-18">
              {q.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelect(q.id, opt)}
                  className={`flex items-center gap-5 p-6 rounded-[1.5rem] border-2 text-left transition-all ${
                    answers[q.id] === opt
                      ? 'border-primary bg-primary/10 text-white shadow-xl ring-1 ring-primary/20'
                      : 'border-white/5 bg-background-dark/50 text-white/50 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    answers[q.id] === opt ? 'border-primary' : 'border-white/10'
                  }`}>
                    {answers[q.id] === opt && <div className="size-3 rounded-full bg-primary animate-scale"></div>}
                  </div>
                  <span className="text-base font-bold">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 z-40 w-full bg-surface-dark/60 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6 border-t-2 border-t-primary/20">
        <div className="hidden sm:flex items-center gap-4 px-4 text-white/40">
          <HelpCircle size={24} />
          <p className="text-xs font-bold leading-relaxed max-w-xs uppercase tracking-widest">Verifica bien tus respuestas antes de la entrega definitiva.</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex-1 sm:flex-none sm:min-w-[280px] h-16 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-95"
        >
          <CheckCircle size={22} />
          Entregar Examen
        </button>
      </div>
      
      <div className="h-10"></div>
    </div>
  );
};

export default ExamModeView;
