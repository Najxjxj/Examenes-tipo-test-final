
import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Clock, 
  Lightbulb, 
  Check, 
  AlertCircle,
  GraduationCap,
  ChevronRight,
  Target
} from 'lucide-react';
import { ExamSession, Question } from '../../types';

interface PracticeViewProps {
  session: ExamSession;
  onFinish: (session: ExamSession) => void;
  onExit: () => void;
}

const PracticeView: React.FC<PracticeViewProps> = ({ session, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const currentQuestion = session.questions[currentIndex];

  const handleSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
    setShowExplanation(true);
    setAnswersMap(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const finishSession = useCallback(() => {
    const finalQuestions = session.questions.map(q => {
      const userAnswer = answersMap[q.id];
      return { ...q, userAnswer, isCorrect: userAnswer === q.correctAnswer };
    });
    onFinish({ ...session, questions: finalQuestions, score: finalQuestions.filter(q => q.isCorrect).length, timeElapsed: time });
  }, [session, answersMap, time, onFinish]);

  const handleNext = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishSession();
    }
  };

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-full bg-background-dark flex flex-col animate-in fade-in duration-1000">
      {/* Header Estilizado */}
      <header className="sticky top-0 z-50 h-20 shrink-0 border-b border-surface-border bg-background-dark/95 backdrop-blur-2xl px-8 md:px-14 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-text-main text-lg font-black tracking-tight leading-none">Simulacro Maestro</h1>
            <p className="text-[9px] text-primary font-black uppercase tracking-[0.25em] mt-1.5 hidden sm:block">Fase de Práctica Activa</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-5 py-2 bg-surface-dark border-2 border-surface-border rounded-2xl shadow-inner">
            <Clock size={18} className="text-primary" />
            <span className="text-text-main font-mono font-bold text-lg">{formatTime(time)}</span>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-3">
              <span className="text-text-main/40 font-black text-[10px] uppercase tracking-widest">{currentIndex + 1} de {session.questions.length}</span>
              <div className="w-32 h-2 bg-surface-border rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(19,127,236,0.6)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => confirm("¿Finalizar sesión prematuramente?") && onExit()} 
            className="size-11 flex items-center justify-center bg-surface-dark/50 hover:bg-danger/10 text-text-main/20 hover:text-danger border border-surface-border rounded-full transition-all shadow-xl"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Área de Pregunta - Grid Principal */}
      <main className="flex-1 p-8 md:p-16 lg:p-24 overflow-x-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Lado Izquierdo: El "Corazón" Académico */}
          <div className="lg:col-span-7 flex flex-col gap-10 animate-in slide-in-from-left duration-1000">
            {/* BLOQUE PREGUNTA: Elegante y Legible */}
            <div className="bg-surface-dark/40 border-2 border-surface-border rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] group transition-all hover:border-primary/30">
              <div className="absolute top-0 left-0 w-2.5 h-full bg-primary/20 group-hover:bg-primary transition-all duration-700"></div>
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                  Cuestión #{currentIndex + 1}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-text-main leading-[1.3] tracking-tight text-pretty">
                {currentQuestion.text}
              </h2>
            </div>

            {/* BLOQUE FEEDBACK: Con contorno definido (Mimetismo de imagen) */}
            {showExplanation && (
              <div className="bg-background-dark/50 border-2 border-primary/30 rounded-[3rem] p-10 md:p-12 animate-in fade-in slide-in-from-bottom-10 duration-700 shadow-2xl relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/20 text-primary rounded-2xl shadow-lg border border-primary/20">
                    <Lightbulb size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-text-main tracking-tight">Análisis del Experto</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-text-main/70 text-lg md:text-xl leading-relaxed font-medium text-justify italic border-l-4 border-primary/40 pl-6 py-2">
                    "{currentQuestion.explanation}"
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-4 p-4 bg-primary text-white rounded-2xl shadow-xl animate-bounce">
                  <Target size={20} />
                </div>
              </div>
            )}
          </div>

          {/* Lado Derecho: Interacción y Opciones */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-in slide-in-from-right duration-1000">
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const isIncorrect = isSelected && !isCorrect;
                
                let btnStyle = "bg-surface-dark/40 border-2 border-surface-border text-text-main/50 hover:bg-surface-dark/80 hover:border-primary/50 hover:scale-[1.02] shadow-xl";
                
                if (showExplanation) {
                  if (isCorrect) btnStyle = "bg-success/10 border-success text-success scale-[1.04] shadow-[0_0_40px_rgba(16,185,129,0.15)] ring-4 ring-success/5";
                  else if (isIncorrect) btnStyle = "bg-danger/10 border-danger text-danger opacity-80 scale-[0.98] ring-4 ring-danger/5";
                  else btnStyle = "opacity-20 grayscale scale-[0.96] pointer-events-none";
                }

                return (
                  <button
                    key={`${currentIndex}-${idx}`}
                    onClick={() => handleSelect(option)}
                    disabled={showExplanation}
                    className={`group relative flex items-center justify-between p-7 rounded-[2rem] transition-all duration-500 text-left ${btnStyle}`}
                  >
                    <span className="text-lg md:text-xl font-bold flex-1 pr-6 leading-snug">{option}</span>
                    <div className={`size-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                      showExplanation && isCorrect ? 'bg-success border-success text-white' : 
                      showExplanation && isIncorrect ? 'bg-danger border-danger text-white' : 
                      'border-surface-border group-hover:border-primary group-hover:bg-primary/5'
                    }`}>
                      {showExplanation && (isCorrect ? <Check size={24} strokeWidth={4} /> : isIncorrect ? <X size={24} strokeWidth={4} /> : null)}
                      {!showExplanation && <div className="size-3 bg-text-main/10 rounded-full group-hover:bg-primary group-hover:scale-150 transition-all duration-500"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-8 animate-in zoom-in duration-500">
                <button 
                  onClick={handleNext}
                  className="w-full h-20 bg-primary hover:bg-primary-dark text-white text-2xl font-black rounded-[2rem] shadow-[0_25px_60px_rgba(19,127,236,0.5)] flex items-center justify-center gap-4 group active:scale-95 transition-all"
                >
                  <span>{currentIndex < session.questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Sesión'}</span>
                  <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Efectos de Iluminación Ambiental */}
      <div className="fixed top-1/4 -left-40 size-[600px] bg-primary/10 blur-[200px] rounded-full -z-10 animate-float pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-40 size-[600px] bg-primary/5 blur-[200px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
};

export default PracticeView;
