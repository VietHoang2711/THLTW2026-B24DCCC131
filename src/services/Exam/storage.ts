import {
  Subject,
  KnowledgeBlock,
  Question,
  ExamTemplate,
  GeneratedExam,
  Difficulty,
} from './types';

const STORAGE_KEY = 'exam_bank_v1';

interface DataShape {
  subjects: Subject[];
  knowledgeBlocks: KnowledgeBlock[];
  questions: Question[];
  templates: ExamTemplate[];
  exams: GeneratedExam[];
}

function read(): DataShape {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial: DataShape = { subjects: [], knowledgeBlocks: [], questions: [], templates: [], exams: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as DataShape;
  } catch (e) {
    const initial: DataShape = { subjects: [], knowledgeBlocks: [], questions: [], templates: [], exams: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function write(data: DataShape) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const ExamStorage = {
  getSubjects(): Subject[] {
    return read().subjects;
  },
  saveSubjects(items: Subject[]) {
    const d = read();
    d.subjects = items;
    write(d);
  },
  getKnowledgeBlocks(): KnowledgeBlock[] {
    return read().knowledgeBlocks;
  },
  saveKnowledgeBlocks(items: KnowledgeBlock[]) {
    const d = read();
    d.knowledgeBlocks = items;
    write(d);
  },
  getQuestions(): Question[] {
    return read().questions;
  },
  saveQuestions(items: Question[]) {
    const d = read();
    d.questions = items;
    write(d);
  },
  getTemplates(): ExamTemplate[] {
    return read().templates;
  },
  saveTemplates(items: ExamTemplate[]) {
    const d = read();
    d.templates = items;
    write(d);
  },
  getExams(): GeneratedExam[] {
    return read().exams;
  },
  saveExams(items: GeneratedExam[]) {
    const d = read();
    d.exams = items;
    write(d);
  },
};

export function sampleDifficulties(): Difficulty[] {
  return ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
}
