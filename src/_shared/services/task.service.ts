import { ITask } from '../interfaces/itask.interface';

const TASK_STORAGE_KEY = 'tasks';
const initialTaskValue: ITask[] = [];

export class TaskService {
  constructor() {
    this.initializeTasks();
  }


  public getAll(): ITask[] {
    const tasks = localStorage.getItem(TASK_STORAGE_KEY)
    return JSON.parse(tasks || '');
  }

  public save(task: ITask) {
    const tasks = this.getAll();
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([...tasks, task]));
  }

  public remove(taskIndex: number) {
    const tasks = this.getAll();
    tasks.splice(taskIndex, 1);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }

  public removeAll() {
    localStorage.setItem(TASK_STORAGE_KEY, '');
    this.initializeTasks();
  }

  private initializeTasks() {
    const tasks = localStorage.getItem(TASK_STORAGE_KEY);
    if (!tasks || !tasks.length) {
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(initialTaskValue));
    }
  }
}
