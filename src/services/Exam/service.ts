// Lightweight UUID generator to avoid adding external dependency
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
import { ExamStorage } from './storage';
import {
  Subject,
  KnowledgeBlock,
  Question,
  ExamTemplate,
  ExamTemplateItem,
  GeneratedExam,
  Difficulty,
} from './types';

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ExamService = {
  listSubjects(): Subject[] {
    return ExamStorage.getSubjects();
  },
  saveSubjects(items: Subject[]) {
    ExamStorage.saveSubjects(items);
  },
  listKnowledgeBlocks(): KnowledgeBlock[] {
    return ExamStorage.getKnowledgeBlocks();
  },
  saveKnowledgeBlocks(items: KnowledgeBlock[]) {
    ExamStorage.saveKnowledgeBlocks(items);
  },
  listQuestions(): Question[] {
    return ExamStorage.getQuestions();
  },
  saveQuestions(items: Question[]) {
    ExamStorage.saveQuestions(items);
  },
  searchQuestions(filters: { subjectId?: string; difficulty?: Difficulty; knowledgeBlockId?: string }) {
    const all = ExamStorage.getQuestions();
    return all.filter((q) => {
      if (filters.subjectId && q.subjectId !== filters.subjectId) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      if (filters.knowledgeBlockId && !q.knowledgeBlockIds.includes(filters.knowledgeBlockId)) return false;
      return true;
    });
  },
  createTemplate(t: Omit<ExamTemplate, 'id'>): ExamTemplate {
    const templates = ExamStorage.getTemplates();
    const newT: ExamTemplate = { ...t, id: uuidv4() };
    templates.push(newT);
    ExamStorage.saveTemplates(templates);
    return newT;
  },
  listTemplates(): ExamTemplate[] {
    return ExamStorage.getTemplates();
  },
  generateExamFromTemplate(templateId: string): GeneratedExam {
    const templates = ExamStorage.getTemplates();
    const template = templates.find((t) => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const questions = ExamStorage.getQuestions().filter((q) => q.subjectId === template.subjectId);

    const selected: string[] = [];

    for (const item of template.items) {
      const pool = questions.filter((q) => q.difficulty === item.difficulty && (item.knowledgeBlockId ? q.knowledgeBlockIds.includes(item.knowledgeBlockId) : true) && !selected.includes(q.id));
      if (pool.length < item.count) {
        throw new Error(`Không đủ câu hỏi cho mục: mức độ ${item.difficulty} khối ${item.knowledgeBlockId || 'Tất cả'}`);
      }
      const pick = shuffle(pool).slice(0, item.count).map((p) => p.id);
      selected.push(...pick);
    }

    const exam: GeneratedExam = {
      id: uuidv4(),
      templateId: template.id,
      subjectId: template.subjectId,
      questionIds: selected,
      createdAt: new Date().toISOString(),
    };

    const exams = ExamStorage.getExams();
    exams.push(exam);
    ExamStorage.saveExams(exams);
    return exam;
  },
  generateExamAdHoc(subjectId: string, items: ExamTemplateItem[]): GeneratedExam {
    const questions = ExamStorage.getQuestions().filter((q) => q.subjectId === subjectId);
    const selected: string[] = [];

    for (const item of items) {
      const pool = questions.filter((q) => q.difficulty === item.difficulty && (item.knowledgeBlockId ? q.knowledgeBlockIds.includes(item.knowledgeBlockId) : true) && !selected.includes(q.id));
      if (pool.length < item.count) {
        throw new Error(`Không đủ câu hỏi cho mục: mức độ ${item.difficulty} khối ${item.knowledgeBlockId || 'Tất cả'}`);
      }
      const pick = shuffle(pool).slice(0, item.count).map((p) => p.id);
      selected.push(...pick);
    }

    const exam: GeneratedExam = {
      id: uuidv4(),
      templateId: undefined,
      subjectId,
      questionIds: selected,
      createdAt: new Date().toISOString(),
    };

    const exams = ExamStorage.getExams();
    exams.push(exam);
    ExamStorage.saveExams(exams);
    return exam;
  },
  listExams(): GeneratedExam[] {
    return ExamStorage.getExams();
  },
};
