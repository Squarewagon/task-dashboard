import { Task } from "../../domain/Task";
import { Category } from "../../domain/Category";
import { LocalStorageTaskRepository } from "../../infrastructure/repositories/LocalStorageTaskRepository";
import { LocalStorageCategoryRepository } from "../../infrastructure/repositories/LocalStorageCategoryRepository";

/**
 * TaskService
 * Application service for managing tasks and categories
 * Encapsulates business logic and coordinates between repositories
 */
export class TaskService {
  private taskRepository: LocalStorageTaskRepository;
  private categoryRepository: LocalStorageCategoryRepository;

  constructor() {
    this.taskRepository = new LocalStorageTaskRepository();
    this.categoryRepository = new LocalStorageCategoryRepository();
  }

  // Task Operations
  createTask(
    title: string,
    category: string,
    description?: string,
    priority?: "low" | "medium" | "high"
  ): Task {
    if (!title.trim()) {
      throw new Error("Task title cannot be empty");
    }

    const categoryExists = this.categoryRepository.getAll().some((c) => c.getName() === category);
    if (!categoryExists) {
      throw new Error(`Category "${category}" does not exist`);
    }

    const task = new Task(title, category, description, priority);
    this.taskRepository.save(task);
    return task;
  }

  getAllTasks(): Task[] {
    return this.taskRepository.getAll();
  }

  getTasksByCategory(category: string): Task[] {
    return this.taskRepository.getAll().filter((t) => t.getCategory() === category);
  }

  getTaskById(id: string): Task | null {
    return this.taskRepository.getById(id);
  }

  updateTask(id: string, updates: Partial<{ title: string; description: string; category: string; priority: string }>): Task | null {
    const task = this.taskRepository.getById(id);
    if (!task) return null;

    if (updates.title !== undefined) task.setTitle(updates.title);
    if (updates.description !== undefined) task.setDescription(updates.description);
    if (updates.category !== undefined) task.setCategory(updates.category);
    if (updates.priority !== undefined && ["low", "medium", "high"].includes(updates.priority)) {
      task.setPriority(updates.priority as "low" | "medium" | "high");
    }

    this.taskRepository.save(task);
    return task;
  }

  toggleTaskCompletion(id: string): Task | null {
    const task = this.taskRepository.getById(id);
    if (!task) return null;

    task.toggleCompletion();
    this.taskRepository.save(task);
    return task;
  }

  deleteTask(id: string): boolean {
    const task = this.taskRepository.getById(id);
    if (!task) return false;

    this.taskRepository.delete(id);
    return true;
  }

  getCompletedTasks(): Task[] {
    return this.taskRepository.getAll().filter((t) => t.getIsCompleted());
  }

  getPendingTasks(): Task[] {
    return this.taskRepository.getAll().filter((t) => !t.getIsCompleted());
  }

  getTasksByPriority(priority: "low" | "medium" | "high"): Task[] {
    return this.taskRepository.getAll().filter((t) => t.getPriority() === priority);
  }

  // Category Operations
  getAllCategories(): Category[] {
    return this.categoryRepository.getAll();
  }

  createCategory(name: string, color?: string): Category {
    if (!name.trim()) {
      throw new Error("Category name cannot be empty");
    }

    const category = new Category(name, color);
    this.categoryRepository.save(category);
    return category;
  }

  updateCategory(id: string, name?: string, color?: string): Category | null {
    const category = this.categoryRepository.getById(id);
    if (!category) return null;

    if (name !== undefined) category.setName(name);
    if (color !== undefined) category.setColor(color);

    this.categoryRepository.save(category);
    return category;
  }

  deleteCategory(id: string): boolean {
    const category = this.categoryRepository.getById(id);
    if (!category) return false;

    this.categoryRepository.delete(id);
    return true;
  }

  // Statistics
  getStatistics() {
    const tasks = this.taskRepository.getAll();
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.getIsCompleted()).length,
      pending: tasks.filter((t) => !t.getIsCompleted()).length,
      byCategory: Array.from(
        new Map(
          tasks.reduce(
            (acc, task) => {
              const cat = task.getCategory();
              return acc.set(cat, (acc.get(cat) || 0) + 1);
            },
            new Map<string, number>()
          )
        )
      ).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {} as Record<string, number>),
    };
  }
}
