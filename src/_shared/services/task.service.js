const TASK_STORAGE_KEY = 'tasks';
const initialTaskValue = [];

export class TaskService {
  constructor() {
    this.initializeTasks();
  }

  initializeTasks() {
    const tasks = localStorage.getItem(TASK_STORAGE_KEY);
    if (!tasks || !tasks.length) {
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(initialTaskValue));
    }
  }

  getAll() {
    return JSON.parse(localStorage.getItem(TASK_STORAGE_KEY));
  }

  save(task) {
    const tasks = this.getAll();
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([...tasks, task]));
  }

  remove(taskIndex) {
    const tasks = this.getAll();
    tasks.splice(taskIndex, 1);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }

  removeAll() {
    localStorage.setItem(TASK_STORAGE_KEY, '');
    this.initializeTasks();
  }
}
