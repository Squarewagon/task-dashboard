import { IRepository } from "./IRepository";
import { Category } from "../../domain/Category";

/**
 * LocalStorageCategoryRepository
 * Implements IRepository using browser localStorage for Category persistence
 */
export class LocalStorageCategoryRepository implements IRepository<Category> {
  private storageKey = "categories";

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    if (this.getAll().length === 0) {
      const defaults = [
        new Category("Work", "#3B82F6"),
        new Category("Personal", "#10B981"),
        new Category("Shopping", "#F59E0B"),
        new Category("Health", "#EF4444"),
      ];
      this.saveAll(defaults);
    }
  }

  save(category: Category): void {
    const categories = this.getAll();
    const index = categories.findIndex((c) => c.getId() === category.getId());
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.saveAll(categories);
  }

  saveAll(categories: Category[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(categories.map((c) => c.toJSON())));
    }
  }

  getAll(): Category[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    try {
      return JSON.parse(data).map((item: any) => Category.fromJSON(item));
    } catch {
      return [];
    }
  }

  getById(id: string): Category | null {
    const categories = this.getAll();
    return categories.find((c) => c.getId() === id) || null;
  }

  delete(id: string): void {
    const categories = this.getAll().filter((c) => c.getId() !== id);
    this.saveAll(categories);
  }

  deleteAll(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }
}
