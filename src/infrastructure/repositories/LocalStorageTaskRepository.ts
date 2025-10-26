import { IRepository } from "./IRepository";
import { Task } from "../../domain/Task";

/**
 * LocalStorageTaskRepository
 * Implements IRepository using browser localStorage for Task persistence
 */
export class LocalStorageTaskRepository implements IRepository<Task> {
  private storageKey = "tasks";

  save(task: Task): void {
    const tasks = this.getAll();
    const index = tasks.findIndex((t) => t.getId() === task.getId());
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    this.saveAll(tasks);
  }

  saveAll(tasks: Task[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks.map((t) => t.toJSON())));
    }
  }

  getAll(): Task[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    try {
      return JSON.parse(data).map((item: any) => Task.fromJSON(item));
    } catch {
      return [];
    }
  }

  getById(id: string): Task | null {
    const tasks = this.getAll();
    return tasks.find((t) => t.getId() === id) || null;
  }

  delete(id: string): void {
    const tasks = this.getAll().filter((t) => t.getId() !== id);
    this.saveAll(tasks);
  }

  deleteAll(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }
}
