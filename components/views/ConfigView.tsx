
import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles,
  ChevronDown,
  Loader2,
  Gauge,
  Type as TypeIcon,
  Layers,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { FileData, ExamSession, QuestionType, StudyMode, Difficulty, ContentLength } from '../../types';
import { generateQuestions, generateTopicImage } from '../../services/geminiService';

interface ConfigViewProps {
  files: FileData[];
  referenceText?: string;
  onGenerate: (session: ExamSession) => void;
}

const ConfigView: React.FC<ConfigViewProps> = ({ files, referenceText, onGenerate }) => {
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.id || '');
  const [type, setType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [length, setLength] = useState<ContentLength>(ContentLength.MEDIUM);
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerate = async () => {
    const file = files.find(f => f.id === selectedFileId);
    if (!file) return;

    setLoading(true);
    try {
      setLoadingStep('Analizando estructura académica...');
      const questions = await generateQuestions(file, count, type, difficulty, length, referenceText);
      
      if (!questions || questions.length === 0) throw new Error("No se pudieron generar preguntas. Verifica el archivo.");

      setLoadingStep('Generando entorno visual...');
      const coverImage = await generateTopicImage(file.name);

      onGenerate({
        id: `session-${Date.now()}`,
        title: `Simulacro: ${file.name}`,
        topic: file.name,
        date: new Date().toLocaleDateString('es-ES'),
        score: 0,
        totalQuestions: questions.length,
        questions,
        mode: StudyMode.PRACTICE,
        difficulty,
        length,
        coverImage
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-10 py-4 animate-fade-in-up">
      <div className="flex flex-col gap-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-[0.3em] w-fit mx-auto border border-primary/20">
          <BrainCircuit size={16} /> Configuración Avanzada
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter leading-none">
          Diseña tu <span className="text-primary italic">Sesión Maestra</span>
        </h1>
        <p className="text-text-main/40 text-xl font-medium max-w-2xl mx-auto">
          Ajusta los parámetros para un mimetismo perfecto con tu examen oficial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Panel Izquierdo: Configuración */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 md:p-14 rounded-[4rem] border border-surface-border shadow-2xl space-y-12 flex-1">
            
            {/* 1. Fuente del Conocimiento */}
            <div className="space-y-5">
              <label className="text-text-main/40 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                <FileText size={16} className="text-primary" /> Fuente del Conocimiento
              </label>
              <div className="relative group">
                <select 
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  className="w-full h-18 px-10 rounded-3xl bg-background-dark/80 border-2 border-surface-border text-text-main font-bold appearance-none cursor-pointer focus:border-primary transition-all shadow-inner hover:bg-background-dark text-lg"
                >
                  {files.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>

            {/* 2. Densidad de la Prueba */}
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <label className="text-text-main/40 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                  <Layers size={16} className="text-primary" /> Densidad de la Prueba
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(19,127,236,0.3)]">{count}</span>
                  <span className="text-text-main/20 text-xs font-black uppercase tracking-widest">Preguntas</span>
                </div>
              </div>
              <div className="px-3">
                <input 
                  type="range" min="3" max="50" step="1" 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* 3. Nivel y Profundidad (Grid Compacto) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              <div className="space-y-6">
                <label className="text-text-main/40 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                  <Gauge size={16} className="text-primary" /> Nivel Cognitivo
                </label>
                <div className="grid grid-cols-3 bg-background-dark/80 p-1.5 rounded-[1.5rem] border-2 border-surface-border gap-1.5">
                  {[
                    { id: Difficulty.EASY, label: 'Básico' },
                    { id: Difficulty.MEDIUM, label: 'Intermedio' },
                    { id: Difficulty.HARD, label: 'Experto' }
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center min-w-0 overflow-hidden ${
                        difficulty === d.id 
                          ? 'bg-primary text-white shadow-[0_12px_24px_rgba(19,127,236,0.4)] scale-[1.05]' 
                          : 'text-text-main/20 hover:text-text-main/60'
                      }`}
                    >
                      <span className="truncate">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-text-main/40 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                  <TypeIcon size={16} className="text-primary" /> Profundidad de Respuesta
                </label>
                <div className="grid grid-cols-3 bg-background-dark/80 p-1.5 rounded-[1.5rem] border-2 border-surface-border gap-1.5">
                  {[
                    { id: ContentLength.SHORT, label: 'Directa' },
                    { id: ContentLength.MEDIUM, label: 'Detallada' },
                    { id: ContentLength.LONG, label: 'Exhaustiva' }
                  ].map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center min-w-0 overflow-hidden ${
                        length === l.id 
                          ? 'bg-primary text-white shadow-[0_12px_24px_rgba(19,127,236,0.4)] scale-[1.05]' 
                          : 'text-text-main/20 hover:text-text-main/60'
                      }`}
                    >
                      <span className="truncate">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: IA & Acción */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-primary/5 border-2 border-primary/20 rounded-[4rem] p-12 flex flex-col items-center text-center gap-10 relative overflow-hidden group flex-1 h-full shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            {/* Icono Central Animado */}
            <div className="relative size-32">
              <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 group-hover:opacity-50 transition-all duration-700"></div>
              <div className="relative size-full rounded-[2.5rem] bg-background-dark border-2 border-primary/40 flex items-center justify-center text-primary shadow-2xl animate-float">
                <Zap size={48} className="fill-primary/20" />
                <Sparkles size={24} className="absolute -top-3 -right-3 text-white" />
              </div>
            </div>

            {/* Texto Descriptivo Actualizado */}
            <div className="space-y-5 relative">
              <h3 className="text-3xl font-black text-text-main tracking-tight">IA Generativa V4.5</h3>
              <p className="text-base text-text-main/50 font-medium leading-relaxed px-2">
                Nuestro motor de IA avanzado procesará tus materiales y ejemplos de referencia para diseñar una evaluación que calque la estructura, complejidad y terminología de tu examen oficial, garantizando un mimetismo absoluto.
              </p>
            </div>
            
            {/* Botón de Acción Principal */}
            <div className="w-full mt-auto">
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-24 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-2xl font-black rounded-[2.5rem] shadow-[0_30px_70px_rgba(19,127,236,0.4)] flex items-center justify-center gap-5 group active:scale-[0.98] transition-all relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Loader2 className="animate-spin" size={28} />
                    <span className="text-lg uppercase tracking-[0.2em]">{loadingStep}</span>
                  </div>
                ) : (
                  <>
                    <span>Empezar Test</span>
                    <Sparkles size={28} className="group-hover:rotate-12 group-hover:scale-125 transition-all duration-500" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigView;
