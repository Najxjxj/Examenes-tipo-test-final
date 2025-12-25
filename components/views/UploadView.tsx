
import React, { useState, useRef } from 'react';
import { 
  CloudUpload, 
  FileText, 
  Info, 
  Trash2, 
  Sparkles, 
  Loader2, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { FileData } from '../../types';

interface UploadViewProps {
  onFilesReady: (files: FileData[], referenceText?: string) => void;
  onCancel: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onFilesReady, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [referenceText, setReferenceText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecciona solo archivos PDF por ahora.');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      const newFileData: FileData = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadedAt: 'Hace un momento',
        status: 'ready',
        type: 'pdf',
        base64Data: base64Data,
        mimeType: file.type
      };

      setTimeout(() => {
        setUploadedFiles(prev => [...prev, newFileData]);
        setIsUploading(false);
        setProgress(0);
      }, 800);
    };

    reader.readAsDataURL(file);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-[#637588] mb-6 uppercase tracking-widest">
        <span>Inicio</span>
        <ChevronRight size={14} />
        <span className="text-white">Subir Documentos</span>
      </nav>

      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-5xl font-black text-white tracking-tighter">Carga tu material de estudio</h1>
        <p className="text-[#92adc9] text-lg font-medium">Sube tus PDFs para generar exámenes automáticamente. Aceptamos archivos de hasta 50MB.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Actions */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
            className={`relative min-h-[300px] rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-10 group ${
              isDragging ? 'border-primary bg-primary/5' : 'border-surface-border bg-surface-dark/50 hover:bg-surface-dark hover:border-white/20'
            }`}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
            <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(19,127,236,0.2)]">
              <CloudUpload size={32} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Arrastra y suelta tus PDFs aquí</h3>
            <p className="text-[#637588] font-bold text-sm mb-8">o selecciona archivos desde tu ordenador</p>
            <button className="px-10 h-14 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
              Explorar Archivos
            </button>
            <p className="mt-8 text-[10px] font-black text-[#4e5e6e] uppercase tracking-widest">Soporta PDF, DOCX (Max 50MB)</p>
          </div>

          {/* Uploading File Item (As seen in image) */}
          {isUploading && (
            <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <CloudUpload size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Subiendo archivo...</p>
                    <p className="text-[#637588] text-xs font-bold uppercase">Procesando metadatos</p>
                  </div>
                </div>
                <span className="text-primary font-black text-lg">{progress}%</span>
              </div>
              <div className="w-full bg-background-dark rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_10px_rgba(19,127,236,0.5)] transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Tips Info Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-5 items-start">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Consejo para mejores resultados</h4>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Asegúrate de que los documentos escaneados sean legibles. StudyGen utiliza OCR avanzado, pero una imagen clara garantiza mejores preguntas de examen.
              </p>
            </div>
          </div>

          {/* Reference Questions (Optional Section from Image) */}
          <div className="bg-surface-dark/50 border border-white/5 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/10">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Preguntas de Referencia</h3>
                  <p className="text-[#637588] text-xs font-bold uppercase tracking-widest">Pega preguntas de exámenes anteriores para que la IA adapte el estilo</p>
                </div>
              </div>
              <span className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black text-[#92adc9] uppercase tracking-widest border border-white/5">Opcional</span>
            </div>
            
            <textarea 
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="Ejemplo:&#10;1. Describe brevemente las causas de...&#10;2. ¿Cuál es la diferencia principal entre...?"
              className="w-full min-h-[160px] bg-background-dark/50 border border-white/5 rounded-2xl p-6 text-white text-sm placeholder:text-[#3d4d5d] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Right Column: Sidebar (As seen in image) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-dark/60 backdrop-blur-md border border-white/5 rounded-[2rem] flex flex-col min-h-[600px] shadow-2xl relative overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white tracking-tight">Archivos Listos</h3>
              <span className="bg-primary/20 text-primary text-xs font-black px-3 py-1 rounded-lg border border-primary/20">{uploadedFiles.length}</span>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              {uploadedFiles.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
                  <FileText size={64} strokeWidth={1} className="mb-4" />
                  <p className="text-sm font-bold">No hay archivos cargados</p>
                </div>
              ) : (
                uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-background-dark/30 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="size-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">{file.name}</p>
                        <p className="text-[#637588] text-[10px] font-black uppercase tracking-widest">{file.size} • Hace un momento</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="p-2 text-[#637588] hover:text-danger hover:bg-danger/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-background-dark/20 flex flex-col gap-4">
              <button 
                onClick={() => onFilesReady(uploadedFiles, referenceText)}
                disabled={uploadedFiles.length === 0}
                className="w-full h-16 bg-primary hover:bg-primary-dark disabled:opacity-30 disabled:grayscale text-white text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <Sparkles size={22} />
                Generar Examen
              </button>
              <p className="text-center text-[10px] font-black text-[#637588] uppercase tracking-widest">
                Se procesarán {uploadedFiles.length} documentos seleccionados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
