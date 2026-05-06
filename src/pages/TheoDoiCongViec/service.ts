import moment from 'moment';

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'doing' | 'done';

export interface TaskItem {
	id: string;
	title: string;
	description?: string;
	deadline?: string;
	priority: Priority;
	tags?: string[];
	status: Status;
	createdAt: string;
}

const STORAGE_KEY = 'theo-doi-cong-viec.tasks';

export const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function loadTasks(): TaskItem[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY) || '[]';
		const data: TaskItem[] = JSON.parse(raw);
		return data.map((d) => ({ ...d }));
	} catch (e) {
		return [];
	}
}

export function saveTasks(tasks: TaskItem[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function emptyTask(): TaskItem {
	return {
		id: genId(),
		title: '',
		description: '',
		deadline: moment().add(1, 'day').toISOString(),
		priority: 'Medium',
		tags: [],
		status: 'todo',
		createdAt: new Date().toISOString(),
	};
}

export default { loadTasks, saveTasks, genId, emptyTask };
