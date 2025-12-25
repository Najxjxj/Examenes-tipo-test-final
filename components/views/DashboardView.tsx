
import React from 'react';
import { 
  CloudUpload, 
  Bolt, 
  BarChart3, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { FileData, ExamSession } from '../../types';

interface DashboardViewProps {
  onUpload: () => void;
  onStartExam: (file: FileData) => void;
  recentFiles: FileData[];
  recentSessions: ExamSession[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  onUpload, 
  onStartExam, 
  recentFiles, 
}) => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-14 py-4 animate-scale-in">
      {/* Hero Section */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[3rem] border border-surface-border bg-surface-dark transition-all duration-700 hover:border-primary/40 hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
        onClick={onUpload}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 md:p-24 min-h-[480px]">
          <div className="mb-12 relative animate-float">
            <div className="absolute inset-0 bg-primary blur-[80px] opacity-20 group-hover:opacity-60 transition-opacity duration-1000"></div>
            <div className="relative size-28 rounded-[2rem] bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-primary/20 shadow-2xl">
              <CloudUpload size={56} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-4 -right-4 size-12 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/20 animate-bounce shadow-lg">
              <Sparkles size={24} />
            </div>
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-7xl font-black leading-[1] tracking-tighter text-text-main transition-all duration-500">
              Libera el <span className="text-primary">Conocimiento</span> de tus PDFs.
            </h1>
            <p className="text-text-main/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              La IA que transforma tus apuntes en simulacros de examen de alta precisión con retroalimentación instantánea.
            </p>
          </div>

          <button className="mt-14 group/btn relative flex items-center gap-4 px-12 h-18 bg-primary text-white text-2xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary-dark hover:scale-105 transition-all active:scale-95">
            <span>Subir Material</span>
            <ArrowRight size={28} className="group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Bolt, title: 'Análisis Profundo', desc: 'Motor Gemini 3 Pro que procesa cada detalle de tus documentos.', delay: '0' },
          { icon: Sparkles, title: 'IA Generativa', desc: 'Preguntas diseñadas para evaluar tu comprensión real, no solo la memoria.', delay: '100' },
          { icon: BarChart3, title: 'Seguimiento de Logros', desc: 'Visualiza tu progreso y fortalece tus puntos débiles test a test.', delay: '200' }
        ].map((feat, i) => (
          <div 
            key={i} 
            className="bg-surface-dark border border-surface-border p-10 rounded-[2.5rem] hover:border-primary/20 transition-all group shadow-xl hover:-translate-y-2 duration-500"
            style={{ animationDelay: `${feat.delay}ms` }}
          >
            <div className="size-14 rounded-2xl bg-text-main/5 flex items-center justify-center text-text-main/40 mb-8 group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-inner">
              <feat.icon size={28} />
            </div>
            <h3 className="text-text-main font-black text-2xl mb-3 tracking-tight">{feat.title}</h3>
            <p className="text-text-main/30 text-base leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Files Table */}
      {recentFiles.length > 0 && (
        <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-3xl font-black text-text-main tracking-tighter">Material Reciente</h2>
          </div>
          <div className="bg-surface-dark border border-surface-border rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <tbody className="divide-y divide-surface-border">
                {recentFiles.slice(0, 5).map((file) => (
                  <tr key={file.id} className="hover:bg-text-main/[0.02] transition-colors group cursor-pointer" onClick={() => onStartExam(file)}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center shrink-0 border border-danger/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <FileText size={28} />
                        </div>
                        <div>
                          <p className="text-text-main font-black text-xl leading-none mb-2">{file.name}</p>
                          <p className="text-text-main/20 text-xs font-black uppercase tracking-widest">{file.size} • PDF Verificado</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="inline-flex items-center gap-4 px-8 py-3 rounded-2xl bg-primary/10 text-primary text-sm font-black border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-lg active:scale-95">
                        Iniciar Prueba <ArrowRight size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardView;
