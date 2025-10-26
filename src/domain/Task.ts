import { Entity } from "./Entity";

/**
 * Task Entity
 * Represents a single task with title, description, and completion status
 */
export class Task extends Entity {
  private title: string;
  private description: string;
  private isCompleted: boolean;
  private category: string;
  private priority: "low" | "medium" | "high";

  constructor(
    title: string,
    category: string,
    description: string = "",
    priority: "low" | "medium" | "high" = "medium",
    isCompleted: boolean = false,
    id?: string
  ) {
    super(id);
    this.title = title;
    this.category = category;
    this.description = description;
    this.priority = priority;
    this.isCompleted = isCompleted;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
    this.setUpdatedAt(new Date());
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
    this.setUpdatedAt(new Date());
  }

  getCategory(): string {
    return this.category;
  }

  setCategory(category: string): void {
    this.category = category;
    this.setUpdatedAt(new Date());
  }

  getIsCompleted(): boolean {
    return this.isCompleted;
  }

  toggleCompletion(): void {
    this.isCompleted = !this.isCompleted;
    this.setUpdatedAt(new Date());
  }

  getPriority(): "low" | "medium" | "high" {
    return this.priority;
  }

  setPriority(priority: "low" | "medium" | "high"): void {
    this.priority = priority;
    this.setUpdatedAt(new Date());
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      isCompleted: this.isCompleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data: any): Task {
    return new Task(
      data.title,
      data.category,
      data.description,
      data.priority,
      data.isCompleted,
      data.id
    );
  }
}
