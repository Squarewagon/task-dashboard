import { Entity } from "./Entity";

/**
 * Category Entity
 * Represents a task category with a name and color
 */
export class Category extends Entity {
  private name: string;
  private color: string;

  constructor(name: string, color: string = "#3B82F6", id?: string) {
    super(id);
    this.name = name;
    this.color = color;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
    this.setUpdatedAt(new Date());
  }

  getColor(): string {
    return this.color;
  }

  setColor(color: string): void {
    this.color = color;
    this.setUpdatedAt(new Date());
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data: any): Category {
    return new Category(data.name, data.color, data.id);
  }
}
