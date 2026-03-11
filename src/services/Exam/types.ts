export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface KnowledgeBlock {
  id: string;
  name: string;
  description?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

export interface Question {
  id: string;
  subjectId: string;
  code?: string;
  content: string;
  difficulty: Difficulty;
  knowledgeBlockIds: string[];
}

export interface ExamTemplateItem {
  difficulty: Difficulty;
  knowledgeBlockId?: string; // optional means any
  count: number;
}

export interface ExamTemplate {
  id: string;
  name: string;
  subjectId: string;
  items: ExamTemplateItem[];
}

export interface GeneratedExam {
  id: string;
  templateId?: string;
  subjectId: string;
  questionIds: string[];
  createdAt: string;
}
