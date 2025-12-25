
export enum View {
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  CONFIG = 'CONFIG',
  PRACTICE = 'PRACTICE',
  EXAM = 'EXAM',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  MIXED = 'MIXED'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum ContentLength {
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LONG = 'LONG'
}

export enum StudyMode {
  PRACTICE = 'PRACTICE',
  EXAM = 'EXAM'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation: string;
  visualPrompt: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface ExamSession {
  id: string;
  title: string;
  topic: string;
  date: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
  mode: StudyMode;
  difficulty: Difficulty;
  length: ContentLength;
  coverImage?: string;
  timeElapsed?: number;
}

export interface FileData {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: 'ready' | 'pending' | 'error';
  type: 'pdf' | 'docx';
  base64Data?: string;
  mimeType?: string;
}

export interface AppState {
  view: View;
  files: FileData[];
  sessions: ExamSession[];
  activeSession: ExamSession | null;
}
